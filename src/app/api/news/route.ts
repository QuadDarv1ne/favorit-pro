import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const news = await db.newsArticle.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ news });
  } catch (error) {
    logger.error('Failed to fetch news', { error: (error as Error).message });
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
