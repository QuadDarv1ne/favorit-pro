'use client';

import { useEffect, useCallback } from 'react';
import { useSession, signOut as nextAuthSignOut, signIn as nextAuthSignIn } from 'next-auth/react';
import { useAppStore, UserProfile } from '@/stores/app-store';
import { createDemoUser } from '@/lib/demo';

function sessionToProfile(session: { user?: { id?: string; name?: string | null; email?: string | null; image?: string | null; role?: string } }): UserProfile | null {
  if (!session?.user?.email) return null;
  const source = session.user.name || session.user.email || '';
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return {
    id: session.user.id || 'unknown',
    name: session.user.name || session.user.email,
    email: session.user.email,
    avatar: initials,
    role: (session.user.role as 'user' | 'expert' | 'admin') || 'user',
    tier: 'free',
    balance: 0,
    totalBets: 0,
    wonBets: 0,
    totalProfit: 0,
    joinedAt: new Date().toLocaleDateString('ru-RU'),
  };
}

export function useAuth() {
  const { data: session, status } = useSession();
  const { login, logout, user, isLoggedIn } = useAppStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const profile = sessionToProfile(session);
      if (profile) {
        // Preserve persisted fields (balance, tier, stats) from Zustand
        const merged = user
          ? { ...profile, balance: user.balance, tier: user.tier, totalBets: user.totalBets, wonBets: user.wonBets, totalProfit: user.totalProfit }
          : profile;
        login(merged);
      }
    } else if (status === 'unauthenticated') {
      if (isLoggedIn) {
        logout();
      }
    }
    // Intentionally omitting user/isLoggedIn — this effect syncs session state only,
    // responding to store changes would cause redundant re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, login, logout]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    });
    return result;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await nextAuthSignIn('credentials', {
      name,
      email,
      password,
      redirect: false,
    });
    return result;
  }, []);

  const signInDemo = useCallback(() => {
    login(createDemoUser());
  }, [login]);

  const signOut = useCallback(async () => {
    await nextAuthSignOut({ redirect: false });
    logout();
  }, [logout]);

  return {
    signIn,
    register,
    signInDemo,
    signOut,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
