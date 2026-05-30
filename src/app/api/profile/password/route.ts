import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';

const PASSWORD_MIN_LENGTH = 8;
const SALT_ROUNDS = 10;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
});

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const { userId } = auth;

    const body = await request.json();
    const validation = passwordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validation.data;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'Account does not have a password set. Use "Forgot Password" to set one.' },
        { status: 400 }
      );
    }

    const validCurrent = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validCurrent) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await db.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Password change failed', { error: (error as Error).message });
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to change password' },
      { status: 500 }
    );
  }
}
