import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters').max(100),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validation = searchQuerySchema.safeParse({
      q: searchParams.get('q') || '',
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.errors[0]?.message || 'Invalid search query',
          matches: [],
          experts: [],
          predictions: [],
        },
        { status: 400 }
      );
    }

    const { q } = validation.data;

    const [matches, experts, predictions] = await Promise.all([
      db.match.findMany({
        where: {
          OR: [
            { homeTeam: { contains: q } },
            { awayTeam: { contains: q } },
            { league: { contains: q } },
          ],
        },
        include: { sport: true },
        take: 10,
      }),
      db.expert.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { bio: { contains: q } },
          ],
        },
        include: { specialty: true },
        take: 10,
      }),
      db.prediction.findMany({
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
      }),
    ]);

    return NextResponse.json({ matches, experts, predictions });
  } catch (error) {
    logger.error('Search failed', { error: (error as Error).message });
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Search failed' },
      { status: 500 }
    );
  }
}
