import { describe, it, expect } from 'vitest';
import { checkRateLimit, getClientIp } from './rate-limiter';

describe('checkRateLimit', () => {
  it('allows first request', () => {
    const result = checkRateLimit('test-ip-1', 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('allows requests within limit', () => {
    const key = 'test-ip-2';
    const results = [];
    for (let i = 0; i < 3; i++) {
      results.push(checkRateLimit(key, 5, 60_000));
    }
    expect(results.every((r) => r.allowed)).toBe(true);
    expect(results[2].remaining).toBe(2);
  });

  it('blocks requests exceeding limit', () => {
    const key = 'test-ip-3';
    const maxRequests = 3;
    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push(checkRateLimit(key, maxRequests, 60_000));
    }
    expect(results[0].allowed).toBe(true);
    expect(results[1].allowed).toBe(true);
    expect(results[2].allowed).toBe(true);
    expect(results[3].allowed).toBe(false);
    expect(results[4].allowed).toBe(false);
  });

  it('returns resetAt timestamp', () => {
    const result = checkRateLimit('test-ip-4', 5, 60_000);
    expect(result.resetAt).toBeGreaterThan(Date.now() - 1000);
    expect(result.resetAt).toBeLessThan(Date.now() + 120_000);
  });
});

describe('getClientIp', () => {
  it('extracts IP from x-real-ip header', () => {
    const headers = new Headers();
    headers.set('x-real-ip', '192.168.1.1');
    expect(getClientIp(headers)).toBe('192.168.1.1');
  });

  it('extracts IP from x-forwarded-for header', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '10.0.0.1, 172.16.0.1');
    expect(getClientIp(headers)).toBe('10.0.0.1');
  });

  it('prefers x-real-ip over x-forwarded-for', () => {
    const headers = new Headers();
    headers.set('x-real-ip', '192.168.1.1');
    headers.set('x-forwarded-for', '10.0.0.1');
    expect(getClientIp(headers)).toBe('192.168.1.1');
  });

  it('returns unknown for invalid IP', () => {
    const headers = new Headers();
    headers.set('x-real-ip', 'not-an-ip');
    expect(getClientIp(headers)).toBe('unknown');
  });

  it('returns unknown when no IP headers present', () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe('unknown');
  });

  it('accepts IPv6 addresses', () => {
    const headers = new Headers();
    headers.set('x-real-ip', '::1');
    expect(getClientIp(headers)).toBe('::1');
  });
});
