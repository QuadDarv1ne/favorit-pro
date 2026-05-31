import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { logger } from '@/lib/logger';

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
  } catch (error) {
    logger.error('[api-helpers] Failed to parse JSON body', { error: (error as Error).message });
    return {
      error: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    };
  }
}

export function sanitizeString(input: string, maxLength = 100): string {
  if (!input) return '';
  // Strip control characters (except newlines/tabs which we'll collapse)
  let cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Decode common HTML entities first
  cleaned = cleaned
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x3C;/g, '<')
    .replace(/&#x3E;/g, '>')
    .replace(/&#x26;/g, '&');
  // Strip HTML tags (handles both original tags and any recreated from entity decoding)
  cleaned = cleaned.replace(/<[^>]*>/g, '').trim();
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  if (!cleaned) return '';
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) : cleaned;
}

export function handleApiError(error: unknown, context: string): NextResponse {
  logger.error(context, { error: (error as Error).message });
  const isDbError = error instanceof Error && error.message.includes('Prisma');
  const message = isDbError
    ? 'Database unavailable. Please try again later.'
    : context;
  return NextResponse.json({ error: message }, { status: 500 });
}
