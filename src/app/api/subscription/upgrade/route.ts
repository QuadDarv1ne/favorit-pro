import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody } from '@/lib/api-helpers';

const upgradeSchema = z.object({
  tier: z.enum(['free', 'pro', 'vip']),
});

const TIER_PRICES: Record<string, number> = {
  free: 0,
  pro: 1490,
  vip: 3990,
};

export async function POST(request: Request) {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  const validation = await validateBody(request, upgradeSchema);
  if ('error' in validation) return validation.error;

  const { tier } = validation.data;
  const { userId } = auth;

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.tier === tier) {
      return NextResponse.json({ error: 'Already on this tier', tier: user.tier }, { status: 400 });
    }

    const price = TIER_PRICES[tier] ?? 0;

    // Downgrading to free is always allowed
    // Upgrading requires sufficient balance
    if (price > 0 && user.balance < price) {
      return NextResponse.json(
        { error: 'Insufficient balance', required: price, current: user.balance },
        { status: 402 }
      );
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        tier,
        balance: price > 0 ? user.balance - price : user.balance,
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

    return NextResponse.json({
      message: `Tier upgraded to ${tier}`,
      user: updated,
      priceDeducted: price,
    });
  } catch (error) {
    console.error('Tier upgrade failed:', error);
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to upgrade tier' },
      { status: 500 }
    );
  }
}
