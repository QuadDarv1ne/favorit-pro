// For static analysis, seed scripts, and direct Prisma access.
// At runtime (API routes), use getDb() from db-factory for the correct database client.
export { db } from './db-prisma';
export { Prisma } from '@prisma/client';
export { initDb, getDb, getDbType, disconnectDb, isPrismaDb, isMongoDb } from './db-factory';
export type { DatabaseClient } from './db-factory';
