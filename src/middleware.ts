import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_LIMIT_MAX_AUTH = 5;
const CLEANUP_INTERVAL_MS = RATE_LIMIT_WINDOW_MS * 2;

type RateLimitEntry = { count: number; resetAt: number };

// In-memory store — note: Edge Runtime may spawn multiple instances,
// so this provides per-instance rate limiting, not distributed.
const rateLimitStore = new Map<string, RateLimitEntry>();

// Track last cleanup time to avoid running it too frequently.
let lastCleanup = Date.now();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown';
}

function cleanupExpiredEntries() {
  const now = Date.now();
  // Skip cleanup if we ran recently — avoids O(n) scan on every request.
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(
  key: string,
  max: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (entry && now < entry.resetAt) {
    if (entry.count >= max) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }
    entry.count++;
    return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
  }

  rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  return { allowed: true, remaining: max - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
}

function buildRateLimitHeaders(
  remaining: number,
  resetAt: number
): Record<string, string> {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return {
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'Retry-After': String(Math.max(0, retryAfter)),
  };
}

const API_READ_PREFIXES = ['/api/experts', '/api/matches', '/api/sports', '/api/predictions'];
const API_WRITE_PREFIXES = ['/api/predictions', '/api/subscribe', '/api/likes'];

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function applySecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/');

  // Always run lazy cleanup to prevent memory leaks without setInterval.
  cleanupExpiredEntries();

  if (!isApi) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
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

  // Write endpoints: stricter limit.
  if (isWriteMethod && isWritePath) {
    const rateKey = `write:${clientIp}:${pathname}`;
    const result = checkRateLimit(rateKey, 10);
    if (!result.allowed) {
      const response = NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
      const headers = buildRateLimitHeaders(result.remaining, result.resetAt);
      for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value);
      }
      applySecurityHeaders(response);
      return response;
    }
  }

  // Read endpoints: higher limit.
  if (isReadPath) {
    const readKey = `read:${clientIp}`;
    const result = checkRateLimit(readKey, RATE_LIMIT_MAX_REQUESTS);
    if (!result.allowed) {
      const response = NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
      const headers = buildRateLimitHeaders(result.remaining, result.resetAt);
      for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value);
      }
      applySecurityHeaders(response);
      return response;
    }
  }

  // Auth endpoints: very strict limit.
  if (pathname.startsWith('/api/auth')) {
    const authKey = `auth:${clientIp}`;
    const result = checkRateLimit(authKey, RATE_LIMIT_MAX_AUTH);
    if (!result.allowed) {
      const response = NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
      const headers = buildRateLimitHeaders(result.remaining, result.resetAt);
      for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value);
      }
      applySecurityHeaders(response);
      return response;
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
