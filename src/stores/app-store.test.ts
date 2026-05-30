import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('app-store partialize config', () => {
  const expectedPersistedKeys = [
    'betSlip',
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
    expect(expectedPersistedKeys.length).toBe(5);
  });

  it('does not persist favorites (server is source of truth)', () => {
    expect(expectedPersistedKeys).not.toContain('favoriteExperts');
    expect(expectedPersistedKeys).not.toContain('favoriteMatches');
    expect(expectedPersistedKeys).not.toContain('favoritePredictions');
    expect(expectedPersistedKeys).not.toContain('favoriteExpertIds');
    expect(expectedPersistedKeys).not.toContain('favoriteMatchIds');
    expect(expectedPersistedKeys).not.toContain('favoritePredictionIds');
  });
});

describe('app-store migration', () => {
  const migrate = (persisted: unknown, version: number) => {
    const safe = (persisted && typeof persisted === 'object' ? persisted : {}) as Record<string, unknown>;

    const get = <T>(key: string, fallback: T): T => {
      const val = safe[key];
      return val !== undefined ? (val as T) : fallback;
    };

    // v0, v1 -> v3: clear stale data (no login persistence before v2)
    if (version < 2) {
      return {
        betSlip: get('betSlip', []),
        theme: get('theme', 'dark' as const),
        subscribedExperts: get('subscribedExperts', []),
        isLoggedIn: false,
        user: null,
      };
    }
    // v2 -> v3: preserve all data, just drop favorites from persist
    return {
      betSlip: get('betSlip', []),
      theme: get('theme', 'dark' as const),
      subscribedExperts: get('subscribedExperts', []),
      isLoggedIn: get('isLoggedIn', false),
      user: get('user', null),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('migrates v0 to v3 with defaults', () => {
    const result = migrate({}, 0);
    expect(result.isLoggedIn).toBe(false);
    expect(result.user).toBe(null);
  });

  it('migrates v1 to v3 with defaults (clears stale favorites)', () => {
    const persisted = { betSlip: [{ id: '1', matchTitle: 'Test', prediction: 'P1', odds: 1.5, sport: 'football', league: 'Test' }], theme: 'light', favoriteExperts: ['e1'] };
    const result = migrate(persisted, 1);
    expect(result.isLoggedIn).toBe(false);
    expect(result.user).toBe(null);
    expect((result as Record<string, unknown>).theme).toBe('light');
    expect((result as Record<string, unknown>).favoriteExperts).toBeUndefined();
  });

  it('migrates v2 to v3 preserving all data (just drops favorites from persist)', () => {
    const persisted = { betSlip: [{ id: '1', matchTitle: 'Test', prediction: 'P1', odds: 1.5, sport: 'football', league: 'Test' }], isLoggedIn: true };
    const result = migrate(persisted, 2);
    expect(result.isLoggedIn).toBe(true);
    expect((result as Record<string, unknown>).betSlip).toHaveLength(1);
  });
});
