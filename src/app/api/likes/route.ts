import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth, validateBody, handleApiError } from '@/lib/api-helpers';

const likesSchema = z.object({
  predictionId: z.string().min(1, 'predictionId required'),
});

const likesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const query = likesQuerySchema.parse({
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0',
    });

    const likes = await db.like.findMany({
      where: { userId: auth.userId },
      include: {
        prediction: {
          include: {
            expert: true,
            match: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    });

    return NextResponse.json({ likes });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch likes');
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const validation = await validateBody(request, likesSchema);
    if ('error' in validation) return validation.error;

    const { predictionId } = validation.data;

    const prediction = await db.prediction.findUnique({ where: { id: predictionId } });
    if (!prediction) {
      return NextResponse.json({ error: 'Prediction not found' }, { status: 404 });
    }

    const result = await db.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { userId_predictionId: { userId: auth.userId, predictionId } },
      });

      if (existing) {
        await tx.like.delete({ where: { id: existing.id } });
        return { liked: false };
      }

      await tx.like.create({
        data: { userId: auth.userId, predictionId },
      });

      return { liked: true };
    });

    return NextResponse.json(result, { status: result.liked ? 201 : 200 });
  } catch (error) {
    return handleApiError(error, 'Failed to toggle like');
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('predictionId');
    if (!predictionId) {
      return NextResponse.json({ error: 'predictionId required' }, { status: 400 });
    }

    const deleted = await db.like.deleteMany({
      where: {
        userId: auth.userId,
        predictionId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    return NextResponse.json({ deleted: deleted.count });
  } catch (error) {
    return handleApiError(error, 'Failed to delete like');
  }
}
