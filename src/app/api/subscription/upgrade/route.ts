import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody, handleApiError } from '@/lib/api-helpers';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const upgradeSchema = z.object({
  tier: z.enum(['free', 'pro', 'vip']),
});

const TIER_PRICES: Record<string, number> = {
  free: 0,
  pro: 1490,
  vip: 3990,
};

const TIER_LEVELS: Record<string, number> = {
  free: 0,
  pro: 1,
  vip: 2,
};

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const validation = await validateBody(request, upgradeSchema);
    if ('error' in validation) return validation.error;

    const { tier } = validation.data;
    const { userId } = auth;

    const updated = await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new ApiError('User not found', 404);
      }

      if (user.tier === tier) {
        throw new ApiError('Already on this tier', 400);
      }

      // Prevent downgrades: users can only upgrade to higher tiers
      const currentLevel = TIER_LEVELS[user.tier] ?? 0;
      const targetLevel = TIER_LEVELS[tier] ?? 0;
      if (targetLevel <= currentLevel) {
        throw new ApiError('Downgrades are not allowed. Contact support to change your tier.', 400);
      }

      const price = TIER_PRICES[tier] ?? 0;

      if (price > 0 && user.balance < price) {
        throw new ApiError('Insufficient balance', 402);
      }

      return tx.user.update({
        where: { id: userId },
        data: {
          tier,
          balance: { decrement: price },
        },
        select: {
          id: true,
          email: true,
          name: true,
          tier: true,
          balance: true,
          role: true,
        },
      });
    });

    return NextResponse.json({
      message: `Tier upgraded to ${tier}`,
      user: updated,
      priceDeducted: TIER_PRICES[tier] ?? 0,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return handleApiError(error, 'Failed to upgrade tier');
  }
}
