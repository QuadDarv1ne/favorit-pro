/* eslint-disable no-console */
import type { PrismaClient } from '@prisma/client';
import { MongoAdapter, getMongoAdapter } from './db-mongodb';
import { detectDbType, type DbType } from './env-schema';

export type DatabaseClient = PrismaClient | MongoAdapter;

let _db: DatabaseClient | null = null;
let _dbType: DbType | null = null;

/**
 * Initialize the database client based on DATABASE_URL.
 * - SQLite/PostgreSQL: Uses Prisma client (generated)
 * - MongoDB: Uses MongoAdapter (custom adapter with Prisma-like API)
 *
 * Call this once during app startup. Subsequent calls return the cached instance.
 */
export async function initDb(): Promise<DatabaseClient> {
  if (_db) return _db;

  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
  _dbType = detectDbType(databaseUrl);

  if (_dbType === 'mongodb') {
    const adapter = getMongoAdapter(databaseUrl);
    await adapter.connect();
    _db = adapter;
    console.log(`[DB] Connected to MongoDB`);
  } else {
    // Dynamic import to avoid bundling Prisma when using MongoDB
    const { db } = await import('./db-prisma');
    _db = db;
    console.log(`[DB] Connected to ${_dbType} via Prisma`);
  }

  return _db;
}

/**
 * Get the database type (sqlite, postgresql, or mongodb).
 */
export function getDbType(): DbType {
  if (!_dbType) {
    const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
    _dbType = detectDbType(databaseUrl);
  }
  return _dbType;
}

/**
 * Get the database client synchronously.
 * Throws if initDb() hasn't been called yet.
 */
export function getDb(): DatabaseClient {
  if (!_db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return _db;
}

/**
 * Disconnect the database client (useful for cleanup in tests/shutdown).
 */
export async function disconnectDb(): Promise<void> {
  if (_db) {
    const dbType = getDbType();
    if (dbType === 'mongodb') {
      await (_db as MongoAdapter).disconnect();
    } else {
      await (_db as PrismaClient).$disconnect();
    }
    _db = null;
    _dbType = null;
  }
}

// Re-export type guards
export function isPrismaDb(db: DatabaseClient): db is PrismaClient {
  return '$disconnect' in db && typeof (db as PrismaClient).$connect === 'function';
}

export function isMongoDb(db: DatabaseClient): db is MongoAdapter {
  return 'connected' in db && typeof (db as MongoAdapter).connect === 'function';
}
