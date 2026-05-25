import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, expertId } = body;

    if (!userId || !expertId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await db.subscription.findUnique({
      where: {
        userId_expertId: { userId, expertId },
      },
    });

    if (existing) {
      // Unsubscribe
      await db.subscription.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ subscribed: false });
    }

    // Subscribe
    await db.subscription.create({
      data: { userId, expertId },
    });

    return NextResponse.json({ subscribed: true }, { status: 201 });
  } catch (error) {
    console.error('Subscription failed:', error);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
