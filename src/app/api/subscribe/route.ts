import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody } from '@/lib/api-helpers';

const subscribeSchema = z.object({
  expertId: z.string().min(1, 'expertId required'),
});

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const validation = await validateBody(request, subscribeSchema);
    if ('error' in validation) return validation.error;

    const { expertId } = validation.data;
    const { userId } = auth;

    const expert = await db.expert.findUnique({ where: { id: expertId } });
    if (!expert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    const result = await db.$transaction(async (tx) => {
      const existing = await tx.subscription.findUnique({
        where: { userId_expertId: { userId, expertId } },
      });

      if (existing) {
        await tx.subscription.delete({ where: { id: existing.id } });
        return { subscribed: false };
      }

      await tx.subscription.create({ data: { userId, expertId } });
      return { subscribed: true };
    });

    return NextResponse.json(result, result.subscribed ? { status: 201 } : undefined);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ subscribed: true, message: 'Already subscribed' }, { status: 200 });
    }
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
