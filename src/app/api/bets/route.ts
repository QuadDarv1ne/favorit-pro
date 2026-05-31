import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody, handleApiError } from '@/lib/api-helpers';

const BET_ERRORS = {
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
} as const;

class BetError extends Error {
  constructor(message: string, public code: keyof typeof BET_ERRORS) {
    super(message);
    this.name = 'BetError';
  }
}

const selectionSchema = z.object({
  prediction: z.string().min(1),
  odds: z.number().min(1.01),
  matchTitle: z.string().min(1),
  league: z.string(),
  sport: z.string(),
});

const placeBetSchema = z.object({
  selections: z.array(selectionSchema).min(1, 'At least one selection required').max(20),
  stake: z.number().min(1, 'Minimum stake is 1'),
  type: z.enum(['single', 'express', 'system']),
}).refine((data) => {
  if (data.type === 'single' && data.selections.length !== 1) {
    return false;
  }
  return true;
}, { message: 'Single bets require exactly one selection' });

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const validation = await validateBody(request, placeBetSchema);
    if ('error' in validation) return validation.error;

    const { userId } = auth;
    const { selections, stake, type } = validation.data;

    const totalOdds = type === 'express'
      ? selections.reduce((acc, s) => acc * s.odds, 1)
      : selections[0].odds;

    const potentialWin = parseFloat((stake * totalOdds).toFixed(2));

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      if (!user) {
        throw new BetError('User not found', BET_ERRORS.USER_NOT_FOUND);
      }

      if (user.balance < stake) {
        throw new BetError('Недостаточно средств на балансе', BET_ERRORS.INSUFFICIENT_FUNDS);
      }

      const bet = await tx.bet.create({
        data: {
          userId,
          stake,
          totalOdds,
          potentialWin,
          type,
          selections: {
            create: selections,
          },
        },
        include: { selections: true },
      });

      await tx.user.update({
        where: { id: userId },
        data: { balance: user.balance - stake },
      });

      return bet;
    });

    return NextResponse.json({ bet: result }, { status: 201 });
  } catch (error) {
    if (error instanceof BetError) {
      if (error.code === BET_ERRORS.USER_NOT_FOUND) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.code === BET_ERRORS.INSUFFICIENT_FUNDS) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    return handleApiError(error, 'Failed to place bet');
  }
}

export async function GET() {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const { userId } = auth;

    const bets = await db.bet.findMany({
      where: { userId },
      include: { selections: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ bets });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch bets');
  }
}
