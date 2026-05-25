import { z } from 'zod';

export type DbType = 'sqlite' | 'postgresql' | 'mongodb';

export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().default('file:./dev.db'),
  MONGODB_URI: z.string().url().optional(),
  DATABASE_TYPE: z.enum(['sqlite', 'postgresql', 'mongodb']).optional(),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),

  // Server
  PORT: z.coerce.number().int().positive().default(3000),
  SOCKET_SERVER_URL: z.string().url().default('http://localhost:3003'),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEFAULT_LOCALE: z.string().default('ru'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function detectDbType(url: string): DbType {
  if (url.startsWith('mongodb')) return 'mongodb';
  if (url.startsWith('postgresql') || url.startsWith('postgres')) return 'postgresql';
  return 'sqlite';
}

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment variables:\n${issues}\n\nCheck your .env file against .env.example`);
  }
  return result.data;
}
