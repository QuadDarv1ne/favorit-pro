'use client';

import { useEffect, useCallback, useRef } from 'react';
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
  const { login, logout } = useAppStore();
  const demoModeRef = useRef(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Real auth login takes over, clear demo mode
      demoModeRef.current = false;

      const profile = sessionToProfile(session);
      if (!profile) return;

      const abortController = new AbortController();

      (async () => {
        try {
          const res = await fetch('/api/subscription/status', { signal: abortController.signal });
          if (abortController.signal.aborted) return;

          let serverData: { user: { tier: string; balance: number }; subscribedExperts: string[] } | null = null;
          if (res.ok) {
            serverData = await res.json();
          }

          if (abortController.signal.aborted) return;

          const merged = serverData
            ? { ...profile, tier: serverData.user.tier as UserProfile['tier'], balance: serverData.user.balance }
            : profile;

          // Sync server subscription state into store
          if (serverData?.subscribedExperts) {
            useAppStore.setState({ subscribedExperts: serverData.subscribedExperts });
          }

          const currentUser = useAppStore.getState().user;
          const final = currentUser
            ? { ...merged, totalBets: currentUser.totalBets, wonBets: currentUser.wonBets, totalProfit: currentUser.totalProfit }
            : merged;
          login(final);
        } catch (error) {
          if ((error as Error).name === 'AbortError') return;
          if (abortController.signal.aborted) return;
          login(profile);
        }
      })();

      return () => {
        abortController.abort();
      };
    } else if (status === 'unauthenticated') {
      // Don't logout if we're in demo mode
      if (useAppStore.getState().isLoggedIn && !demoModeRef.current) {
        logout();
      }
    }
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
      action: 'register',
      redirect: false,
    });
    return result;
  }, []);

  const signInDemo = useCallback(() => {
    demoModeRef.current = true;
    login(createDemoUser());
  }, [login]);

  const signOut = useCallback(async () => {
    demoModeRef.current = false;
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
