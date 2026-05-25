import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sanitizeString } from '@/lib/api-helpers';

// Validate critical environment variables at startup
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    'NEXTAUTH_SECRET environment variable is required. Set it in your .env file.',
  );
}

const SALT_ROUNDS = 10;
const RATE_LIMIT_TTL = 60_000;
const LOGIN_RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const MAX_STORE_SIZE = 5000;
const MAX_NAME_LENGTH = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let lastCleanup = Date.now();
function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < RATE_LIMIT_TTL * 2) return;
  lastCleanup = now;

  for (const [key, entry] of LOGIN_RATE_LIMIT) {
    if (now >= entry.resetAt) LOGIN_RATE_LIMIT.delete(key);
  }
}

// Enforce max size to prevent memory growth
function evictIfNeeded() {
  if (LOGIN_RATE_LIMIT.size >= MAX_STORE_SIZE) {
    const firstKey = LOGIN_RATE_LIMIT.keys().next().value;
    if (firstKey) LOGIN_RATE_LIMIT.delete(firstKey);
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  cleanupExpiredEntries();
  evictIfNeeded();

  const entry = LOGIN_RATE_LIMIT.get(ip);

  // Create or reset entry atomically
  if (!entry || now >= entry.resetAt) {
    LOGIN_RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_LIMIT_TTL });
    return true;
  }

  // Atomically increment and check
  entry.count++;
  if (entry.count > 5) return false;
  return true;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text', optional: true },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Extract client IP: prefer x-real-ip (set by reverse proxy) over x-forwarded-for
        // x-forwarded-for can be spoofed if not behind a trusted proxy
        const rawIp = req.headers?.['x-real-ip']
          ?? (req.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim()
          ?? 'unknown';
        // Validate IP format (basic IPv4/IPv6 check)
        const ip = /^[0-9a-f.:]+$/i.test(rawIp) ? rawIp : 'unknown';
        if (!checkRateLimit(ip)) return null;

        const email = credentials.email.toLowerCase().trim();
        if (!EMAIL_REGEX.test(email)) return null;

        const user = await db.user.findUnique({ where: { email } });

        if (user) {
          if (user.passwordHash) {
            const valid = await bcrypt.compare(credentials.password, user.passwordHash);
            if (!valid) return null;
          }
          await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
          return { id: user.id, name: user.name ?? user.email, email: user.email, role: user.role };
        }

        // Registration: only when name is provided (explicit registration, not accidental login)
        if (credentials.name) {
          const sanitizedName = sanitizeString(credentials.name, MAX_NAME_LENGTH);
          if (!sanitizedName) return null;

          if (credentials.password.length < 8) return null;

          const hash = await bcrypt.hash(credentials.password, SALT_ROUNDS);
          const newUser = await db.user.create({
            data: {
              email,
              name: sanitizedName,
              passwordHash: hash,
              role: 'user',
            },
          });
          return { id: newUser.id, name: newUser.name ?? newUser.email, email: newUser.email, role: newUser.role };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
