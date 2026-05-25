import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

const expertsQuerySchema = z.object({
  sportId: z.string().min(1).max(50).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validation = expertsQuerySchema.safeParse({
      sportId: searchParams.get('sportId') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    const { sportId, limit = 20 } = validation.success ? validation.data : { limit: 20 };

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
