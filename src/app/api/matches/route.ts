import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sportId = searchParams.get('sportId');
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(1, rawLimit), 100) : 20;

    const where: Prisma.MatchWhereInput = {};
    if (status) where.status = status;
    if (sportId) where.sportId = sportId;

    const matches = await db.match.findMany({
      where,
      include: {
        sport: true,
        predictions: {
          include: { expert: true },
        },
      },
      orderBy: { startTime: 'asc' },
      take: limit,
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
