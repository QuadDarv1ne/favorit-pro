import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth, validateBody } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';

const likesSchema = z.object({
  predictionId: z.string().min(1, 'predictionId required'),
});

export async function GET() {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  try {
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
    });

    return NextResponse.json({ likes });
  } catch (error) {
    logger.error('Error fetching likes', { error: (error as Error).message });
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  const validation = await validateBody(request, likesSchema);
  if ('error' in validation) return validation.error;

  const { predictionId } = validation.data;

  try {
    const prediction = await db.prediction.findUnique({ where: { id: predictionId } });
    if (!prediction) {
      return NextResponse.json({ error: 'Prediction not found' }, { status: 404 });
    }

    const like = await db.like.create({
      data: {
        userId: auth.userId,
        predictionId,
      },
    });

    return NextResponse.json({ like }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ message: 'Already liked' }, { status: 200 });
    }
    logger.error('Error creating like', { error: (error as Error).message });
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to create like' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  const validation = await validateBody(request, likesSchema);
  if ('error' in validation) return validation.error;

  const { predictionId } = validation.data;

  try {
    const prediction = await db.prediction.findUnique({ where: { id: predictionId } });
    if (!prediction) {
      return NextResponse.json({ error: 'Prediction not found' }, { status: 404 });
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
    logger.error('Error deleting like', { error: (error as Error).message });
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to delete like' },
      { status: 500 }
    );
  }
}
