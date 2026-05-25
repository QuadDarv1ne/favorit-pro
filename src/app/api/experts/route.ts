import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportId = searchParams.get('sportId');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (sportId) where.specialtyId = sportId;

    const experts = await db.expert.findMany({
      where,
      include: {
        specialty: true,
        predictions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { match: true },
        },
      },
      orderBy: { winRate: 'desc' },
      take: limit,
    });

    return NextResponse.json({ experts });
  } catch (error) {
    console.error('Failed to fetch experts:', error);
    return NextResponse.json({ error: 'Failed to fetch experts' }, { status: 500 });
  }
}
