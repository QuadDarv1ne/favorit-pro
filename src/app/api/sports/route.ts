import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const querySchema = z.object({
  sportId: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validation = querySchema.safeParse({
      sportId: searchParams.get('sportId') ?? undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { sportId } = validation.data;

    const sports = await db.sport.findMany({
      where: sportId ? { id: sportId } : undefined,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ sports });
  } catch (error) {
    console.error('Error fetching sports:', error);
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to fetch sports' },
      { status: 500 }
    );
  }
}
