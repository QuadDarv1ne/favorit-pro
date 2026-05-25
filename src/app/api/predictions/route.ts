import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = searchParams.get('result');
    const sportId = searchParams.get('sportId');
    const expertId = searchParams.get('expertId');
    const limit = parseInt(searchParams.get('limit') || '20');

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
    const body = await request.json();
    const { expertId, matchId, prediction, odds, confidence, analysis } = body;

    if (!expertId || !matchId || !prediction || !odds || !confidence) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPrediction = await db.prediction.create({
      data: {
        expertId,
        matchId,
        prediction,
        odds: parseFloat(odds),
        confidence: parseInt(confidence),
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
