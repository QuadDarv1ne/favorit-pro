/**
 * Unified rate limiter for API routes and middleware.
 * Uses an in-memory Map with TTL-based cleanup and LRU eviction
 * to prevent memory growth.
 *
 * Note: In multi-instance deployments (Vercel, Docker), rate limits
 * are per-instance. For global rate limiting, use Redis or similar.
 */

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds (default: 60_000) */
  windowMs?: number;
  /** Maximum store size before evicting old entries (default: 5000) */
  maxStoreSize?: number;
  /** Cleanup interval in milliseconds (default: 120_000) */
  cleanupIntervalMs?: number;
}

// Shared store for all rate limit buckets
const rateLimitStore = new Map<string, RateLimitEntry>();

// Track last cleanup time to avoid running it too frequently
let lastCleanup = Date.now();

/**
 * Lazy cleanup of expired entries to prevent memory leaks.
 * Skips cleanup if we ran recently to avoid O(n) scan on every request.
 */
function cleanupExpiredEntries(cleanupIntervalMs: number) {
  const now = Date.now();
  if (now - lastCleanup < cleanupIntervalMs) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore) {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Evict oldest entries if store is at capacity.
 */
function evictIfNeeded(maxSize: number) {
  if (rateLimitStore.size >= maxSize) {
    const firstKey = rateLimitStore.keys().next().value;
    if (firstKey) rateLimitStore.delete(firstKey);
  }
}

/**
 * Check if a request is within rate limits.
 * @param key - Unique identifier (usually IP-based prefix)
 * @param config - Rate limit configuration
 * @returns { allowed: boolean; remaining: number; resetAt: number }
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  const {
    maxRequests,
    windowMs = 60_000,
    maxStoreSize = 5000,
    cleanupIntervalMs = 120_000,
  } = config;

  const now = Date.now();

  cleanupExpiredEntries(cleanupIntervalMs);
  evictIfNeeded(maxStoreSize);

  const entry = rateLimitStore.get(key);

  // Create or reset entry atomically
  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  // Atomically increment and check
  entry.count++;
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract client IP from NextRequest headers.
 * Prefers x-real-ip (set by reverse proxy) over x-forwarded-for.
 */
export function getClientIp(headers: Headers): string {
  const rawIp = headers.get('x-real-ip')
    ?? headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown';

  // Validate IP format (basic IPv4/IPv6 check)
  return /^[0-9a-f.:]+$/i.test(rawIp) ? rawIp : 'unknown';
}

/**
 * Build rate limit response headers.
 */
export function buildRateLimitHeaders(
  remaining: number,
  resetAt: number,
): Record<string, string> {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return {
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'Retry-After': String(Math.max(0, retryAfter)),
  };
}
