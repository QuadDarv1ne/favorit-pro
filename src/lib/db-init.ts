/* eslint-disable no-console */
/**
 * Database initialization module.
 * Import this in your app entry point to initialize the database connection.
 *
 * For Next.js App Router, import in src/app/layout.tsx or a server component:
 *   import { initDb } from '@/lib/db-init';
 *   await initDb();
 */
import { initDb, getDbType, disconnectDb } from './db-factory';
import { getConfig } from './config';

let _initialized = false;

/**
 * Initialize the database and configuration.
 * Safe to call multiple times — only runs once.
 */
export async function initDatabase(): Promise<void> {
  if (_initialized) return;

  try {
    const config = await getConfig();
    console.log(`[Config] Database type: ${config.dbType}`);
    console.log(`[Config] Server port: ${config.port}`);
    console.log(`[Config] App URL: ${config.appUrl}`);

    await initDb();
    console.log(`[DB] Database initialized: ${getDbType()}`);

    _initialized = true;
  } catch (error) {
    console.error('[DB] Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Graceful shutdown handler — disconnects the database.
 */
export async function shutdownDatabase(): Promise<void> {
  await disconnectDb();
  console.log('[DB] Database disconnected');
}

// Register graceful shutdown — only once, even with HMR reload
if (typeof process !== 'undefined' && !(globalThis as Record<string, unknown>).__dbShutdownRegistered) {
  process.on('SIGINT', shutdownDatabase);
  process.on('SIGTERM', shutdownDatabase);
  (globalThis as Record<string, unknown>).__dbShutdownRegistered = true;
}
