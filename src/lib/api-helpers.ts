import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { session, userId: (session.user as { id: string }).id };
}

export async function validateBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<
  | { error: NextResponse<unknown> }
  | { data: z.infer<T> }
> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return {
        error: NextResponse.json(
          { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        ),
      };
    }

    return { data: parsed.data };
  } catch {
    return {
      error: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    };
  }
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

const SANITIZE_REGEX = /<[^>]*>/g;

export function sanitizeString(input: string, maxLength = 100): string {
  const cleaned = input.replace(SANITIZE_REGEX, '').trim();
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) : cleaned;
}
