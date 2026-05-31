import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BetSlipItem {
  id: string;
  matchTitle: string;
  prediction: string;
  odds: number;
  sport: string;
  league: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'expert' | 'admin';
  tier: 'free' | 'pro' | 'vip';
  balance: number;
  totalBets: number;
  wonBets: number;
  totalProfit: number;
  joinedAt: string;
}

interface AppStore {
  // Bet slip
  betSlip: BetSlipItem[];
  betSlipOpen: boolean;
  addBet: (item: BetSlipItem) => void;
  removeBet: (id: string) => void;
  clearBetSlip: () => void;
  toggleBetSlip: () => void;
  setBetSlipOpen: (open: boolean) => void;

  // Favorites (IDs only, synced from server)
  favoriteMatchIds: string[];
  favoriteExpertIds: string[];
  favoritePredictionIds: string[];
  setFavorites: (matchIds: string[], expertIds: string[], predictionIds: string[]) => void;
  toggleFavoriteExpertId: (expertId: string) => void;
  toggleFavoriteMatchId: (matchId: string) => void;
  toggleFavoritePredictionId: (predictionId: string) => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // User
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateBalance: (amount: number) => void;
  setTier: (tier: 'free' | 'pro' | 'vip') => void;

  // Live odds changes tracking
  oddsChanges: Record<string, { old: number; newOdds: number; direction: 'up' | 'down'; timestamp: number }>;
  setOddsChange: (key: string, oldOdds: number, newOdds: number) => void;
  clearOddsChange: (key: string) => void;

  // Subscriptions
  subscribedExperts: string[];
  toggleSubscription: (expertId: string) => void;

  // Subscription modal
  subscriptionModalOpen: boolean;
  setSubscriptionModalOpen: (open: boolean) => void;
}

interface PersistedState {
  betSlip: BetSlipItem[];
  theme: 'dark' | 'light';
  subscribedExperts: string[];
  isLoggedIn: boolean;
  user: UserProfile | null;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Bet slip
      betSlip: [],
      betSlipOpen: false,

      addBet: (item) => {
        const exists = get().betSlip.find((b) => b.id === item.id);
        if (exists) {
          set({ betSlip: get().betSlip.filter((b) => b.id !== item.id) });
        } else {
          set({ betSlip: [...get().betSlip, item] });
        }
      },

      removeBet: (id) => {
        set({ betSlip: get().betSlip.filter((b) => b.id !== id) });
      },

      clearBetSlip: () => {
        set({ betSlip: [] });
      },

      toggleBetSlip: () => {
        set({ betSlipOpen: !get().betSlipOpen });
      },

      setBetSlipOpen: (open) => {
        set({ betSlipOpen: open });
      },

      // Favorites (IDs only, synced from server)
      favoriteMatchIds: [],
      favoriteExpertIds: [],
      favoritePredictionIds: [],

      setFavorites: (matchIds, expertIds, predictionIds) => {
        set({ favoriteMatchIds: matchIds, favoriteExpertIds: expertIds, favoritePredictionIds: predictionIds });
      },

      toggleFavoriteExpertId: (expertId) => {
        const ids = get().favoriteExpertIds;
        set({ favoriteExpertIds: ids.includes(expertId) ? ids.filter((id) => id !== expertId) : [...ids, expertId] });
      },

      toggleFavoriteMatchId: (matchId) => {
        const ids = get().favoriteMatchIds;
        set({ favoriteMatchIds: ids.includes(matchId) ? ids.filter((id) => id !== matchId) : [...ids, matchId] });
      },

      toggleFavoritePredictionId: (predictionId) => {
        const ids = get().favoritePredictionIds;
        set({ favoritePredictionIds: ids.includes(predictionId) ? ids.filter((id) => id !== predictionId) : [...ids, predictionId] });
      },

      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', newTheme === 'dark' ? '#10b981' : '#ffffff');
      },

      // User
      user: null,
      isLoggedIn: false,

      login: (user) => {
        set({ user, isLoggedIn: true });
      },

      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          subscribedExperts: [],
          favoriteMatchIds: [],
          favoriteExpertIds: [],
          favoritePredictionIds: [],
          oddsChanges: {},
          subscriptionModalOpen: false,
          // Preserve: theme, betSlip, betSlipOpen
        });
      },

      updateUser: (updates) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      updateBalance: (amount) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, balance: user.balance + amount } });
        }
      },

      setTier: (tier) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, tier } });
        }
      },

      // Live odds changes
      oddsChanges: {},

      setOddsChange: (key, oldOdds, newOdds) => {
        const direction = newOdds > oldOdds ? 'up' : 'down';
        set({
          oddsChanges: {
            ...get().oddsChanges,
            [key]: { old: oldOdds, newOdds, direction, timestamp: Date.now() },
          },
        });
      },

      clearOddsChange: (key) => {
        const changes = { ...get().oddsChanges };
        delete changes[key];
        set({ oddsChanges: changes });
      },

      // Subscriptions
      subscribedExperts: [],

      toggleSubscription: (expertId) => {
        const subs = get().subscribedExperts;
        if (subs.includes(expertId)) {
          set({ subscribedExperts: subs.filter((id) => id !== expertId) });
        } else {
          set({ subscribedExperts: [...subs, expertId] });
        }
      },

      // Subscription modal
      subscriptionModalOpen: false,
      setSubscriptionModalOpen: (open) => {
        set({ subscriptionModalOpen: open });
      },
    }),
    {
      name: 'favoritpro-store',
      version: 3,
      partialize: (state: AppStore) => ({
        betSlip: state.betSlip,
        theme: state.theme,
        subscribedExperts: state.subscribedExperts,
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
      migrate: (persisted: unknown, version: number): PersistedState => {
        const safe = (persisted && typeof persisted === 'object' ? persisted : {}) as Record<string, unknown>;

        const get = <T>(key: string, fallback: T): T => {
          const val = safe[key];
          return val !== undefined ? (val as T) : fallback;
        };

        // v0, v1 -> v3: clear stale data (no login persistence before v2)
        if (version < 2) {
          return {
            betSlip: get('betSlip', []),
            theme: get('theme', 'dark' as const),
            subscribedExperts: get('subscribedExperts', []),
            isLoggedIn: false,
            user: null,
          };
        }
        // v2 -> v3: preserve all data, just drop favorites from persist
        return {
          betSlip: get('betSlip', []),
          theme: get('theme', 'dark' as const),
          subscribedExperts: get('subscribedExperts', []),
          isLoggedIn: get('isLoggedIn', false),
          user: get('user', null),
        };
      },
    }
  )
);
