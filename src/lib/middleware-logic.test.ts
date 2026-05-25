import { describe, it, expect, vi } from 'vitest';

// We test the middleware logic by extracting and testing the rate limit functions directly
// Since middleware is a Next.js edge function, we test the logic in isolation

describe('middleware rate limiting logic', () => {
  type RateLimitEntry = { count: number; resetAt: number };

  const RATE_LIMIT_WINDOW_MS = 60_000;
  const MAX_STORE_SIZE = 10_000;

  function createRateLimitStore() {
    const store = new Map<string, RateLimitEntry>();

    function checkRateLimit(key: string, max: number) {
      const now = Date.now();

      if (store.size >= MAX_STORE_SIZE && !store.has(key)) {
        const firstKey = store.keys().next().value;
        if (firstKey) store.delete(firstKey);
      }

      const entry = store.get(key);

      if (entry && now < entry.resetAt) {
        if (entry.count >= max) {
          return { allowed: false, remaining: 0, resetAt: entry.resetAt };
        }
        entry.count++;
        return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
      }

      store.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      return { allowed: true, remaining: max - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    }

    return { store, checkRateLimit };
  }

  describe('checkRateLimit', () => {
    it('allows first request', () => {
      const { checkRateLimit } = createRateLimitStore();
      const result = checkRateLimit('read:127.0.0.1', 30);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });

    it('blocks after max requests', () => {
      const { checkRateLimit } = createRateLimitStore();
      for (let i = 0; i < 30; i++) {
        checkRateLimit('read:127.0.0.1', 30);
      }
      const result = checkRateLimit('read:127.0.0.1', 30);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('resets after window expires', () => {
      const { checkRateLimit } = createRateLimitStore();

      // Use up all requests
      for (let i = 0; i < 30; i++) {
        checkRateLimit('read:127.0.0.1', 30);
      }

      // Mock time advancing past the window
      vi.useFakeTimers();
      vi.advanceTimersByTime(RATE_LIMIT_WINDOW_MS + 1000);

      const result = checkRateLimit('read:127.0.0.1', 30);
      expect(result.allowed).toBe(true);

      vi.useRealTimers();
    });

    it('evicts oldest entry when store is at capacity', () => {
      const { store, checkRateLimit } = createRateLimitStore();

      // Fill store to max capacity
      for (let i = 0; i < MAX_STORE_SIZE; i++) {
        checkRateLimit(`read:ip-${i}`, 30);
      }

      expect(store.size).toBe(MAX_STORE_SIZE);

      // Next request should evict oldest
      checkRateLimit('read:new-ip', 30);
      expect(store.size).toBe(MAX_STORE_SIZE);
      expect(store.has('read:new-ip')).toBe(true);
      expect(store.has('read:ip-0')).toBe(false);
    });
  });
});
