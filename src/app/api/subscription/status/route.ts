import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/api-helpers';

export async function GET() {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const { userId } = auth;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        balance: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get active expert subscriptions
    const subscriptions = await db.subscription.findMany({
      where: { userId },
      select: { expertId: true },
    });

    return NextResponse.json({
      user,
      subscribedExperts: subscriptions.map((s) => s.expertId),
    });
  } catch (error) {
    console.error('Failed to fetch subscription status:', error);
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
