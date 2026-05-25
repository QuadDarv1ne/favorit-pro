import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody, sanitizeString } from '@/lib/api-helpers';

const profileSchema = z.object({
  name: z.string().min(2, 'Name too short').max(50).optional(),
  email: z.string().email('Invalid email').optional(),
});

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth();
    if ('error' in auth) return auth.error;

    const validation = await validateBody(request, profileSchema);
    if ('error' in validation) return validation.error;

    const { userId } = auth;
    const updates = validation.data;

    const existingUser = await db.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If email is being changed, check uniqueness
    if (updates.email && updates.email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email: updates.email },
      });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
    }

    const sanitizedName = updates.name ? sanitizeString(updates.name, 50) : undefined;
    const avatar = sanitizedName
      ? sanitizedName.split(/\s+/).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'
      : undefined;

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        ...(sanitizedName && { name: sanitizedName }),
        ...(updates.email && { email: updates.email }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        tier: true,
        balance: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updated, message: 'Profile updated' });
  } catch (error) {
    console.error('Profile update failed:', error);
    const isDbError = error instanceof Error && error.message.includes('Prisma');
    return NextResponse.json(
      { error: isDbError ? 'Database unavailable. Please try again later.' : 'Failed to update profile' },
      { status: 500 }
    );
  }
}
