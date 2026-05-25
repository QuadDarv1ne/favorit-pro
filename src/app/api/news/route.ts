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
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
