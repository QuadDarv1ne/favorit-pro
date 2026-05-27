import { NextResponse } from 'next/server';
import { db, Prisma } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody } from '@/lib/api-helpers';

const predictionSchema = z.object({
  matchId: z.string().min(1, 'matchId required'),
  prediction: z.string().min(1, 'prediction required').max(500),
  odds: z.coerce.number().min(1.01, 'odds must be >= 1.01').max(1000),
  confidence: z.coerce.number().min(0).max(100),
  analysis: z.string().max(5000).optional(),
});

const predictionsQuerySchema = z.object({
  result: z.enum(['win', 'loss', 'pending']).optional(),
  sportId: z.string().optional(),
  expertId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validation = predictionsQuerySchema.safeParse({
      result: searchParams.get('result') ?? undefined,
      sportId: searchParams.get('sportId') ?? undefined,
      expertId: searchParams.get('expertId') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { result, sportId, expertId, limit = 20 } = validation.data;

    const where: Prisma.PredictionWhereInput = {};
    if (result) where.result = result;
    if (expertId) where.expertId = expertId;
    if (sportId) where.match = { sportId };

    const predictions = await db.prediction.findMany({
      where,
      include: {
        expert: true,
        match: {
          include: { sport: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    });

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('Failed to fetch predictions:', error);
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const validation = await validateBody(request, predictionSchema);
    if ('error' in validation) return validation.error;

    const { matchId, prediction, odds, confidence, analysis } = validation.data;
    const { userId: expertId } = auth;

    const user = await db.user.findUnique({ where: { id: expertId } });
    if (!user || user.role !== 'expert') {
      return NextResponse.json({ error: 'Only experts can create predictions' }, { status: 403 });
    }

    const match = await db.match.findUnique({ where: { id: matchId } });
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    if (match.status === 'finished') {
      return NextResponse.json({ error: 'Cannot create predictions for finished matches' }, { status: 400 });
    }

    const newPrediction = await db.prediction.create({
      data: {
        expertId,
        matchId,
        prediction,
        odds,
        confidence,
        analysis: analysis || '',
        result: 'pending',
      },
      include: {
        expert: true,
        match: { include: { sport: true } },
      },
    });

    return NextResponse.json({ prediction: newPrediction }, { status: 201 });
  } catch (error) {
    console.error('Failed to create prediction:', error);
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to create prediction' },
      { status: 500 }
    );
  }
}
