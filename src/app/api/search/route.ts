import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { handleApiError } from '@/lib/api-helpers';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

const SEARCH_RATE_LIMIT = 20; // requests per window
const SEARCH_WINDOW_MS = 60_000; // 1 minute

const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters').max(100),
});

export async function GET(request: Request) {
  // Rate limit check
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(ip, {
    maxRequests: SEARCH_RATE_LIMIT,
    windowMs: SEARCH_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

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
            // @ts-expect-error -- Prisma SQLite runtime supports mode: 'insensitive' (Prisma 5.7+), but generated types lag
            { homeTeam: { contains: q, mode: 'insensitive' } },
            // @ts-expect-error -- Prisma SQLite runtime supports mode: 'insensitive'
            { awayTeam: { contains: q, mode: 'insensitive' } },
            // @ts-expect-error -- Prisma SQLite runtime supports mode: 'insensitive'
            { league: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: { sport: true },
        take: 10,
      }),
      db.expert.findMany({
        where: {
          OR: [
            // @ts-expect-error -- Prisma SQLite runtime supports mode: 'insensitive'
            { name: { contains: q, mode: 'insensitive' } },
            // @ts-expect-error -- Prisma SQLite runtime supports mode: 'insensitive'
            { bio: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: { specialty: true },
        take: 10,
      }),
      db.prediction.findMany({
        where: {
          OR: [
            // @ts-expect-error -- Prisma SQLite runtime supports mode: 'insensitive'
            { prediction: { contains: q, mode: 'insensitive' } },
            // @ts-expect-error -- Prisma SQLite runtime supports mode: 'insensitive'
            { analysis: { contains: q, mode: 'insensitive' } },
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
    return handleApiError(error, 'Search failed');
  }
}
