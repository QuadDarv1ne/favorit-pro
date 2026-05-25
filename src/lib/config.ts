import { validateEnv, detectDbType, type DbType, type EnvConfig } from './env-schema';
import { findFreePort } from './find-free-port';

export interface AppConfig {
  env: EnvConfig;
  dbType: DbType;
  port: number;
  appUrl: string;
  socketUrl: string;
}

let _config: AppConfig | null = null;

/**
 * Initialize and validate the application configuration.
 * - Validates all environment variables against the Zod schema
 * - Auto-detects database type from DATABASE_URL if DATABASE_TYPE is not set
 * - Finds a free port if the configured port is busy (dev only)
 * - Caches the result for subsequent calls
 */
export async function getConfig(): Promise<AppConfig> {
  if (_config) return _config;

  const env = validateEnv();

  // Auto-detect database type
  const dbType = env.DATABASE_TYPE ?? detectDbType(env.DATABASE_URL);

  // Find a free port in development
  let port = env.PORT;
  if (env.NODE_ENV === 'development') {
    port = await findFreePort(env.PORT);
  }

  // Build app URL with the actual port
  const parsedUrl = new URL(env.NEXTAUTH_URL);
  parsedUrl.port = String(port);
  const appUrl = parsedUrl.toString().replace(/\/$/, '');

  // Build socket URL with port + 3 offset
  const parsedSocket = new URL(env.SOCKET_SERVER_URL);
  parsedSocket.port = String(port + 3);
  const socketUrl = parsedSocket.toString().replace(/\/$/, '');

  _config = { env, dbType, port, appUrl, socketUrl };
  return _config;
}

/**
 * Get configuration synchronously (throws if not yet initialized).
 * Use during runtime after the app has been initialized.
 */
export function getConfigSync(): AppConfig {
  if (!_config) {
    throw new Error('Config not initialized. Call getConfig() first.');
  }
  return _config;
}

/**
 * Reset the cached configuration (useful for testing).
 */
export function resetConfig(): void {
  _config = null;
}
