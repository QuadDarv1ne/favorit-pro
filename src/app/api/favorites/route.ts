import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';

const favoriteSchema = z.object({
  entityType: z.enum(['match', 'expert', 'prediction'], {
    errorMap: () => ({ message: 'entityType must be match, expert, or prediction' }),
  }),
  entityId: z.string().min(1, 'entityId required'),
});

export async function GET() {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const { userId } = auth;

    const favorites = await db.favorite.findMany({
      where: { userId },
      select: { entityType: true, entityId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const matchIds = favorites.filter((f) => f.entityType === 'match').map((f) => f.entityId);
    const expertIds = favorites.filter((f) => f.entityType === 'expert').map((f) => f.entityId);
    const predictionIds = favorites.filter((f) => f.entityType === 'prediction').map((f) => f.entityId);

    return NextResponse.json({ matchIds, expertIds, predictionIds });
  } catch (error) {
    logger.error('Failed to fetch favorites', { error: (error as Error).message });
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to fetch favorites' },
      { status: 500 }
    );
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
    logger.error('Favorite toggle error', { error: (error as Error).message });
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Internal server error' },
      { status: 500 }
    );
  }
}
