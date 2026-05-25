import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sportId = searchParams.get('sportId');
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '20') || 20), 100);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (sportId) where.sportId = sportId;

    const matches = await db.match.findMany({
      where,
      include: {
        sport: true,
        predictions: {
          include: {
            expert: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
      take: limit,
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
