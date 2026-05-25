import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

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
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = predictionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { matchId, prediction, odds, confidence, analysis } = parsed.data;
    const expertId = (session.user as { id: string }).id;

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
    return NextResponse.json({ error: 'Failed to create prediction' }, { status: 500 });
  }
}
