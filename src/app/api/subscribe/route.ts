import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody } from '@/lib/api-helpers';

const subscribeSchema = z.object({
  expertId: z.string().min(1, 'expertId required'),
});

export async function POST(request: Request) {
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

  const existing = await db.subscription.findUnique({
    where: { userId_expertId: { userId, expertId } },
  });

  if (existing) {
    await db.subscription.delete({ where: { id: existing.id } });
    return NextResponse.json({ subscribed: false });
  }

  await db.subscription.create({ data: { userId, expertId } });
  return NextResponse.json({ subscribed: true }, { status: 201 });
}
