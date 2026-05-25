import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sanitizeString } from './api-helpers';

vi.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

describe('api-helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sanitizeString', () => {
    it('removes HTML tags', () => {
      expect(sanitizeString('<script>alert(1)</script>hello')).toBe('alert(1)hello');
    });

    it('trims whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('returns empty string for empty input', () => {
      expect(sanitizeString('')).toBe('');
    });

    it('collapses no spaces (preserves single spaces)', () => {
      expect(sanitizeString('hello world')).toBe('hello world');
    });

    it('truncates to maxLength', () => {
      const long = 'a'.repeat(200);
      const result = sanitizeString(long, 50);
      expect(result.length).toBe(50);
    });

    it('strips nested tags', () => {
      expect(sanitizeString('<b><i>text</i></b>')).toBe('text');
    });
  });
});
