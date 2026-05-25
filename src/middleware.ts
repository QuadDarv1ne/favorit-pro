import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_LIMIT_MAX_AUTH = 5;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.ip || 'unknown';
}

function checkRateLimit(key: string, max = RATE_LIMIT_MAX_REQUESTS): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (entry && now < entry.resetAt) {
    if (entry.count >= max) return false;
    entry.count++;
    return true;
  }

  rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  return true;
}

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanupOldEntries, RATE_LIMIT_WINDOW_MS * 2);

const API_READ_PREFIXES = ['/api/experts', '/api/matches', '/api/sports', '/api/predictions'];
const API_WRITE_PREFIXES = ['/api/predictions', '/api/subscribe', '/api/likes'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/');

  if (!isApi) {
    const response = NextResponse.next();

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()'
    );

    return response;
  }

  const isWriteMethod =
    request.method === 'POST' ||
    request.method === 'PUT' ||
    request.method === 'DELETE' ||
    request.method === 'PATCH';

  const isReadPath = API_READ_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isWritePath = API_WRITE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const clientIp = getClientIp(request);

  if (isWriteMethod && isWritePath) {
    const rateKey = `write:${clientIp}:${pathname}`;
    if (!checkRateLimit(rateKey, 10)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  if (isReadPath) {
    const readKey = `read:${clientIp}`;
    if (!checkRateLimit(readKey, 60)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  if (pathname.startsWith('/api/auth')) {
    const authKey = `auth:${clientIp}`;
    if (!checkRateLimit(authKey, RATE_LIMIT_MAX_AUTH)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }
  }

  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
