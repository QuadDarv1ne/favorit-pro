import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sanitizeString } from '@/lib/api-helpers';

const SALT_ROUNDS = 10;
const LOGIN_RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const MAX_NAME_LENGTH = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = LOGIN_RATE_LIMIT.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= 5) return false;
    entry.count++;
    return true;
  }
  LOGIN_RATE_LIMIT.set(ip, { count: 1, resetAt: now + 60_000 });
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

        const ip = req.headers?.['x-forwarded-for']
          ? (req.headers['x-forwarded-for'] as string).split(',')[0].trim()
          : 'unknown';
        if (!checkRateLimit(ip)) return null;

        const email = credentials.email.toLowerCase().trim();
        if (!EMAIL_REGEX.test(email)) return null;

        const user = await db.user.findUnique({ where: { email } });

        if (user) {
          if (user.passwordHash) {
            const valid = await bcrypt.compare(credentials.password, user.passwordHash);
            if (!valid) return null;
          }
          return { id: user.id, name: user.name ?? user.email, email: user.email, role: user.role };
        }

        if (credentials.name) {
          const sanitizedName = sanitizeString(credentials.name, MAX_NAME_LENGTH);
          if (!sanitizedName) return null;

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
