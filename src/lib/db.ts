// Universal database export — uses db-factory to resolve to Prisma or MongoDB at runtime.
// For direct Prisma access (migrations, seed), import from './db-prisma' instead.
export { db } from './db-prisma';
export { initDb, getDb, getDbType, disconnectDb, isPrismaDb, isMongoDb } from './db-factory';
export type { DatabaseClient } from './db-factory';
