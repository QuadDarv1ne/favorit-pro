import { describe, it, expect } from 'vitest';
import { detectDbType, envSchema } from './env-schema';

describe('env-schema', () => {
  describe('detectDbType', () => {
    it('detects SQLite', () => {
      expect(detectDbType('file:./dev.db')).toBe('sqlite');
      expect(detectDbType('file:/data/my.db')).toBe('sqlite');
    });

    it('detects PostgreSQL', () => {
      expect(detectDbType('postgresql://user:pass@localhost:5432/db')).toBe('postgresql');
      expect(detectDbType('postgres://user:pass@localhost:5432/db')).toBe('postgresql');
    });

    it('detects MongoDB', () => {
      expect(detectDbType('mongodb://localhost:27017/favoritpro')).toBe('mongodb');
      expect(detectDbType('mongodb+srv://user:pass@cluster.mongodb.net/db')).toBe('mongodb');
    });
  });

  describe('envSchema', () => {
    it('accepts valid SQLite config', () => {
      const result = envSchema.safeParse({
        DATABASE_URL: 'file:./dev.db',
        NEXTAUTH_SECRET: 'secret123',
        PORT: 3000,
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid PostgreSQL config', () => {
      const result = envSchema.safeParse({
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        NEXTAUTH_SECRET: 'secret123',
        DATABASE_TYPE: 'postgresql',
        PORT: 3000,
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid MongoDB config', () => {
      const result = envSchema.safeParse({
        DATABASE_URL: 'mongodb://localhost:27017/favoritpro',
        NEXTAUTH_SECRET: 'secret123',
        DATABASE_TYPE: 'mongodb',
        PORT: 3000,
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing NEXTAUTH_SECRET', () => {
      const result = envSchema.safeParse({
        DATABASE_URL: 'file:./dev.db',
        PORT: 3000,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid DATABASE_TYPE', () => {
      const result = envSchema.safeParse({
        DATABASE_URL: 'file:./dev.db',
        NEXTAUTH_SECRET: 'secret123',
        DATABASE_TYPE: 'mysql',
      });
      expect(result.success).toBe(false);
    });

    it('uses default values', () => {
      const result = envSchema.safeParse({
        DATABASE_URL: 'file:./dev.db',
        NEXTAUTH_SECRET: 'secret123',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.PORT).toBe(3000);
        expect(result.data.NODE_ENV).toBe('development');
        expect(result.data.DEFAULT_LOCALE).toBe('ru');
        expect(result.data.NEXTAUTH_URL).toBe('http://localhost:3000');
      }
    });
  });
});
