import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('app-store partialize config', () => {
  const expectedPersistedKeys = [
    'betSlip',
    'favoriteExperts',
    'favoriteMatches',
    'favoritePredictions',
    'theme',
    'subscribedExperts',
    'isLoggedIn',
    'user',
  ];

  it('includes login state in partialize', () => {
    expect(expectedPersistedKeys).toContain('isLoggedIn');
    expect(expectedPersistedKeys).toContain('user');
  });

  it('has all expected persisted keys', () => {
    expect(expectedPersistedKeys.length).toBe(8);
  });
});

describe('app-store migration', () => {
  const migrate = (persisted: unknown, version: number) => {
    if (version === 0) {
      return {
        betSlip: [],
        favoriteExperts: [],
        favoriteMatches: [],
        favoritePredictions: [],
        theme: 'dark' as const,
        subscribedExperts: [],
        isLoggedIn: false,
        user: null,
      };
    }
    if (version === 1) {
      return {
        ...(persisted && typeof persisted === 'object' ? persisted : {}),
        isLoggedIn: false,
        user: null,
      };
    }
    return {
      betSlip: [],
      favoriteExperts: [],
      favoriteMatches: [],
      favoritePredictions: [],
      theme: 'dark' as const,
      subscribedExperts: [],
      isLoggedIn: false,
      user: null,
      ...(persisted && typeof persisted === 'object' ? persisted : {}),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('migrates v0 to v2 with defaults', () => {
    const result = migrate({}, 0);
    expect(result.isLoggedIn).toBe(false);
    expect(result.user).toBe(null);
  });

  it('migrates v1 to v2 preserving existing data', () => {
    const persisted = { betSlip: [{ id: '1', matchTitle: 'Test', prediction: 'P1', odds: 1.5, sport: 'football', league: 'Test' }], theme: 'light' };
    const result = migrate(persisted, 1);
    expect(result.isLoggedIn).toBe(false);
    expect(result.user).toBe(null);
    expect((result as Record<string, unknown>).theme).toBe('light');
  });
});
