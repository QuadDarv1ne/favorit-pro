import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const subscribeSchema = z.object({
  expertId: z.string().min(1, 'expertId required'),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { expertId } = parsed.data;
    const userId = (session.user as { id: string }).id;

    const existing = await db.subscription.findUnique({
      where: { userId_expertId: { userId, expertId } },
    });

    if (existing) {
      await db.subscription.delete({ where: { id: existing.id } });
      return NextResponse.json({ subscribed: false });
    }

    await db.subscription.create({ data: { userId, expertId } });
    return NextResponse.json({ subscribed: true }, { status: 201 });
  } catch (error) {
    console.error('Subscription failed:', error);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
