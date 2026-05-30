import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { handleApiError } from '@/lib/api-helpers';

export async function GET() {
  try {
    const news = await db.newsArticle.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ news });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch news');
  }
}
