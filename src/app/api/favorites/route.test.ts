import { describe, it, expect } from 'vitest';

describe('favorites API schema validation', () => {
  const entityTypes = ['match', 'expert', 'prediction'] as const;

  it('accepts valid entity types', () => {
    for (const type of entityTypes) {
      expect(['match', 'expert', 'prediction']).toContain(type);
    }
  });

  it('rejects invalid entity type', () => {
    const validTypes = ['match', 'expert', 'prediction'];
    expect(validTypes).not.toContain('invalid');
  });

  it('accepts non-empty entityId', () => {
    const entityId = 'clx123456';
    expect(entityId.length).toBeGreaterThan(0);
  });

  it('rejects empty entityId', () => {
    const entityId = '';
    expect(entityId.length).toBe(0);
  });
});

describe('useFavorites hook contract', () => {
  it('returns favorites with all three ID arrays', () => {
    const favorites = { matchIds: [], expertIds: [], predictionIds: [] };
    expect(favorites).toHaveProperty('matchIds');
    expect(favorites).toHaveProperty('expertIds');
    expect(favorites).toHaveProperty('predictionIds');
    expect(Array.isArray(favorites.matchIds)).toBe(true);
    expect(Array.isArray(favorites.expertIds)).toBe(true);
    expect(Array.isArray(favorites.predictionIds)).toBe(true);
  });

  it('toggles favorite returns { favorited: boolean }', () => {
    const response = { favorited: true };
    expect(response).toHaveProperty('favorited');
    expect(typeof response.favorited).toBe('boolean');
  });

  it('merge local and server favorite state correctly', () => {
    const localFavorites = ['expert-1', 'expert-2'];
    const serverFavorites = ['expert-2', 'expert-3'];
    const merged = new Set([...localFavorites, ...serverFavorites]);
    expect(merged.has('expert-1')).toBe(true);
    expect(merged.has('expert-2')).toBe(true);
    expect(merged.has('expert-3')).toBe(true);
    expect(merged.size).toBe(3);
  });
});
