import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

const matchesQuerySchema = z.object({
  status: z.enum(['live', 'upcoming', 'finished']).optional(),
  sportId: z.string().min(1).max(50).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validation = matchesQuerySchema.safeParse({
      status: searchParams.get('status') || undefined,
      sportId: searchParams.get('sportId') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { status, sportId, limit = 20 } = validation.data;

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
