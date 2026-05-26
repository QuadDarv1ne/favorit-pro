import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody } from '@/lib/api-helpers';

const predictionSchema = z.object({
  matchId: z.string().min(1, 'matchId required'),
  prediction: z.string().min(1, 'prediction required').max(500),
  odds: z.coerce.number().min(1.01, 'odds must be >= 1.01').max(1000),
  confidence: z.coerce.number().min(0).max(100),
  analysis: z.string().max(5000).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = searchParams.get('result');
    const sportId = searchParams.get('sportId');
    const expertId = searchParams.get('expertId');
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(1, rawLimit), 100) : 20;

    const where: Record<string, unknown> = {};
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
      take: limit,
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
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  const validation = await validateBody(request, predictionSchema);
  if ('error' in validation) return validation.error;

  const { matchId, prediction, odds, confidence, analysis } = validation.data;
  const { userId: expertId } = auth;

  // Verify user is an expert
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
}
