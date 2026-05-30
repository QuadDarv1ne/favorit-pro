import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody, handleApiError } from '@/lib/api-helpers';

const favoriteSchema = z.object({
  entityType: z.enum(['match', 'expert', 'prediction'], {
    errorMap: () => ({ message: 'entityType must be match, expert, or prediction' }),
  }),
  entityId: z.string().min(1, 'entityId required'),
});

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const { userId } = auth;

    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('detail') === 'true';

    const favorites = await db.favorite.findMany({
      where: { userId },
      select: { entityType: true, entityId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const matchIds = favorites.filter((f) => f.entityType === 'match').map((f) => f.entityId);
    const expertIds = favorites.filter((f) => f.entityType === 'expert').map((f) => f.entityId);
    const predictionIds = favorites.filter((f) => f.entityType === 'prediction').map((f) => f.entityId);

    const result: Record<string, unknown> = { matchIds, expertIds, predictionIds };

    if (includeDetails) {
      const [matches, experts, predictions] = await Promise.all([
        matchIds.length > 0
          ? db.match.findMany({
              where: { id: { in: matchIds } },
              include: { sport: true, predictions: { include: { expert: { select: { id: true, name: true, avatar: true } } }, take: 1 } },
            })
          : [],
        expertIds.length > 0
          ? db.expert.findMany({
              where: { id: { in: expertIds } },
              include: { specialty: true },
            })
          : [],
        predictionIds.length > 0
          ? db.prediction.findMany({
              where: { id: { in: predictionIds } },
              include: { expert: { select: { id: true, name: true, avatar: true } }, match: true },
            })
          : [],
      ]);

      result.matches = matches;
      result.experts = experts;
      result.predictions = predictions;
    }

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch favorites');
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const validation = await validateBody(request, favoriteSchema);
    if ('error' in validation) return validation.error;

    const { entityType, entityId } = validation.data;
    const { userId } = auth;

    const result = await db.$transaction(async (tx) => {
      const existing = await tx.favorite.findUnique({
        where: { userId_entityType_entityId: { userId, entityType, entityId } },
      });

      if (existing) {
        await tx.favorite.delete({ where: { id: existing.id } });
        return { favorited: false };
      }

      await tx.favorite.create({ data: { userId, entityType, entityId } });
      return { favorited: true };
    });

    return NextResponse.json(result, result.favorited ? { status: 201 } : undefined);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ favorited: true, message: 'Already favorited' }, { status: 200 });
    }
    return handleApiError(error, 'Internal server error');
  }
}
