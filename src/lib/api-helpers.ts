import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return { error: NextResponse.json({ error: 'Unauthorized: missing user ID' }, { status: 401 }) };
  }
  return { session, userId };
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

export function sanitizeString(input: string, maxLength = 100): string {
  if (!input) return '';
  // Strip control characters (except newlines/tabs which we'll collapse)
  let cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Strip HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '').trim();
  // Decode common HTML entities to prevent encoded XSS
  cleaned = cleaned
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x3C;/g, '<')
    .replace(/&#x3E;/g, '>')
    .replace(/&#x26;/g, '&')
    .trim();
  // Re-strip any tags that may have been revealed after entity decoding
  cleaned = cleaned.replace(/<[^>]*>/g, '').trim();
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  if (!cleaned) return '';
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) : cleaned;
}
