import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const news = await db.newsArticle.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ news });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
