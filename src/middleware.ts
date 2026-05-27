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
const MAX_STORE_SIZE = 10_000;

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

  // Evict oldest entries if store is at capacity
  if (rateLimitStore.size >= MAX_STORE_SIZE && !rateLimitStore.has(key)) {
    const firstKey = rateLimitStore.keys().next().value;
    if (firstKey) rateLimitStore.delete(firstKey);
  }

  const entry = rateLimitStore.get(key);

  // Create or reset entry atomically
  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: max - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  // Atomically increment and check
  entry.count++;
  if (entry.count > max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
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

function createRateLimitedResponse(
  error: string,
  status: number,
  remaining: number,
  resetAt: number
): NextResponse {
  const response = NextResponse.json({ error }, { status });
  applyRateLimitHeaders(response, remaining, resetAt);
  applySecurityHeaders(response);
  return response;
}

function applyRateLimitHeaders(
  response: NextResponse,
  remaining: number,
  resetAt: number
) {
  const headers = buildRateLimitHeaders(remaining, resetAt);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
}

const API_READ_PREFIXES = ['/api/experts', '/api/matches', '/api/sports', '/api/predictions', '/api/search', '/api/news', '/api/subscription/status'];
const API_WRITE_PREFIXES = ['/api/predictions', '/api/subscribe', '/api/likes', '/api/profile', '/api/subscription/upgrade'];

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  'X-XSS-Protection': '0',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
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
      return createRateLimitedResponse(
        'Too many requests. Please try again later.',
        429,
        result.remaining,
        result.resetAt
      );
    }
    const response = NextResponse.next();
    applyRateLimitHeaders(response, result.remaining, result.resetAt);
    applySecurityHeaders(response);
    return response;
  }

  // Read endpoints: higher limit.
  if (isReadPath) {
    const readKey = `read:${clientIp}`;
    const result = checkRateLimit(readKey, RATE_LIMIT_MAX_REQUESTS);
    if (!result.allowed) {
      return createRateLimitedResponse(
        'Too many requests. Please try again later.',
        429,
        result.remaining,
        result.resetAt
      );
    }
    const response = NextResponse.next();
    applyRateLimitHeaders(response, result.remaining, result.resetAt);
    applySecurityHeaders(response);
    return response;
  }

  // Auth endpoints: very strict limit.
  if (pathname.startsWith('/api/auth')) {
    const authKey = `auth:${clientIp}`;
    const result = checkRateLimit(authKey, RATE_LIMIT_MAX_AUTH);
    if (!result.allowed) {
      return createRateLimitedResponse(
        'Too many login attempts. Please try again later.',
        429,
        result.remaining,
        result.resetAt
      );
    }
    const response = NextResponse.next();
    applyRateLimitHeaders(response, result.remaining, result.resetAt);
    applySecurityHeaders(response);
    return response;
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
