import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQ = searchParams.get('q') || '';
    const q = rawQ.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s-]/g, '').trim().slice(0, 100).toLowerCase();

    if (!q || q.length < 2) {
      return NextResponse.json({ matches: [], experts: [], predictions: [] });
    }

    // Search matches
    const matches = await db.match.findMany({
      where: {
        OR: [
          { homeTeam: { contains: q } },
          { awayTeam: { contains: q } },
          { league: { contains: q } },
        ],
      },
      include: { sport: true },
      take: 10,
    });

    // Search experts
    const experts = await db.expert.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { bio: { contains: q } },
        ],
      },
      include: { specialty: true },
      take: 10,
    });

    // Search predictions
    const predictions = await db.prediction.findMany({
      where: {
        OR: [
          { prediction: { contains: q } },
          { analysis: { contains: q } },
        ],
      },
      include: {
        expert: true,
        match: { include: { sport: true } },
      },
      take: 10,
    });

    return NextResponse.json({ matches, experts, predictions });
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
