import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active', false && 'disabled')).toBe('base active');
  });

  it('resolves Tailwind conflicts', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('handles array and object inputs', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c');
  });

  it('returns empty string for no classes', () => {
    expect(cn()).toBe('');
  });
});
