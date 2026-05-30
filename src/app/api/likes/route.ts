import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth, validateBody, handleApiError } from '@/lib/api-helpers';

const likesSchema = z.object({
  predictionId: z.string().min(1, 'predictionId required'),
});

export async function GET() {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

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
    return handleApiError(error, 'Failed to create like');
  }
}

export async function DELETE(request: Request) {
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
