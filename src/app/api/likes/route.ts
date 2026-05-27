import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAuth, validateBody } from '@/lib/api-helpers';

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
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    console.error('Error creating like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    console.error('Error deleting like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
