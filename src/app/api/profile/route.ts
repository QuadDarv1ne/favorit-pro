import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAuth, validateBody, sanitizeString, handleApiError } from '@/lib/api-helpers';

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

    // Skip if no fields provided
    if (!updates.name && !updates.email) {
      return NextResponse.json({
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          avatar: existingUser.avatar,
          tier: existingUser.tier,
          balance: existingUser.balance,
          role: existingUser.role,
        },
        message: 'No changes',
      });
    }

    // Normalize email: trim and lowercase
    const normalizedEmail = updates.email ? updates.email.trim().toLowerCase() : undefined;

    // If email is being changed, check uniqueness
    if (normalizedEmail && normalizedEmail !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email: normalizedEmail },
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
        ...(normalizedEmail && { email: normalizedEmail }),
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
    return handleApiError(error, 'Failed to update profile');
  }
}
