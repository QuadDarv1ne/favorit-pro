/**
 * Server-side rate limiter for API routes.
 * Uses an in-memory Map with TTL-based cleanup and LRU eviction
 * to prevent memory growth.
 *
 * Note: In multi-instance deployments (Vercel, Docker), rate limits
 * are per-instance. For global rate limiting, use Redis or similar.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const CLEANUP_INTERVAL = 120_000; // 2 minutes
const DEFAULT_MAX_STORE_SIZE = 5000;

// Shared store for all rate limit buckets
const store = new Map<string, RateLimitEntry>();

let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key);
  }
}

function evictIfNeeded(maxSize: number) {
  if (store.size >= maxSize) {
    const firstKey = store.keys().next().value;
    if (firstKey) store.delete(firstKey);
  }
}

/**
 * Check if a request is within rate limits.
 * @param key - Unique identifier (usually IP address)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60s)
 * @returns { allowed: boolean; remaining: number; resetAt: number }
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number = 60_000,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const maxSize = DEFAULT_MAX_STORE_SIZE;

  cleanupExpiredEntries();
  evictIfNeeded(maxSize);

  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, maxRequests - entry.count);

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining, resetAt: entry.resetAt };
}

/**
 * Extract client IP from request headers.
 * Prefers x-real-ip (set by reverse proxy) over x-forwarded-for.
 */
export function getClientIp(headers: Headers): string {
  const rawIp = headers.get('x-real-ip')
    ?? headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown';

  // Validate IP format (basic IPv4/IPv6 check)
  return /^[0-9a-f.:]+$/i.test(rawIp) ? rawIp : 'unknown';
}
