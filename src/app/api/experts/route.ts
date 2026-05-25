import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportId = searchParams.get('sportId');
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(1, rawLimit), 100) : 20;

    const where: Prisma.ExpertWhereInput = {};
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
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to fetch experts' },
      { status: 500 }
    );
  }
}
