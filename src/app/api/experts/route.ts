import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { handleApiError } from '@/lib/api-helpers';

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

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { sportId, limit = 20 } = validation.data;

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
    return handleApiError(error, 'Failed to fetch experts');
  }
}
