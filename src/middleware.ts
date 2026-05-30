import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, buildRateLimitHeaders, getClientIp as extractClientIp } from '@/lib/rate-limiter';

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_READ = 30;
const RATE_LIMIT_MAX_WRITE = 10;
const RATE_LIMIT_MAX_AUTH = 5;

const API_READ_PREFIXES = [
  '/api/experts',
  '/api/matches',
  '/api/sports',
  '/api/search',
  '/api/news',
  '/api/subscription/status',
];

const API_WRITE_PREFIXES = [
  '/api/predictions',
  '/api/subscribe',
  '/api/likes',
  '/api/profile',
  '/api/subscription/upgrade',
  '/api/bets',
];

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

function applySecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
}

function applyRateLimitHeaders(
  response: NextResponse,
  remaining: number,
  resetAt: number,
) {
  const headers = buildRateLimitHeaders(remaining, resetAt);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
}

function createRateLimitedResponse(
  error: string,
  status: number,
  remaining: number,
  resetAt: number,
): NextResponse {
  const response = NextResponse.json({ error }, { status });
  applyRateLimitHeaders(response, remaining, resetAt);
  applySecurityHeaders(response);
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/');

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

  const clientIp = extractClientIp(request.headers);

  // Write endpoints: stricter limit.
  if (isWriteMethod && isWritePath) {
    const rateKey = `write:${clientIp}:${pathname}`;
    const result = checkRateLimit(rateKey, {
      maxRequests: RATE_LIMIT_MAX_WRITE,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });
    if (!result.allowed) {
      return createRateLimitedResponse(
        'Too many requests. Please try again later.',
        429,
        result.remaining,
        result.resetAt,
      );
    }
    const response = NextResponse.next();
    applyRateLimitHeaders(response, result.remaining, result.resetAt);
    applySecurityHeaders(response);
    return response;
  }

  // Read endpoints: higher limit.
  if (isReadPath) {
    const readKey = `read:${clientIp}:${pathname}`;
    const result = checkRateLimit(readKey, {
      maxRequests: RATE_LIMIT_MAX_READ,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });
    if (!result.allowed) {
      return createRateLimitedResponse(
        'Too many requests. Please try again later.',
        429,
        result.remaining,
        result.resetAt,
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
    const result = checkRateLimit(authKey, {
      maxRequests: RATE_LIMIT_MAX_AUTH,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });
    if (!result.allowed) {
      return createRateLimitedResponse(
        'Too many login attempts. Please try again later.',
        429,
        result.remaining,
        result.resetAt,
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
