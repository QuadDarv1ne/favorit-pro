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

export interface FavoriteMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  startTime: string;
  status?: 'live' | 'upcoming' | 'finished';
  prediction?: string;
  homeOdds?: number;
  awayOdds?: number;
  homeScore?: number;
  awayScore?: number;
  confidence?: number;
}

export interface FavoritePrediction {
  id: string;
  matchTitle: string;
  prediction: string;
  odds: number;
  expertName: string;
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

  // Favorites
  favoriteExperts: string[];
  toggleFavoriteExpert: (expertId: string) => void;
  favoriteMatches: FavoriteMatch[];
  toggleFavoriteMatch: (match: FavoriteMatch) => void;
  favoritePredictions: FavoritePrediction[];
  toggleFavoritePrediction: (prediction: FavoritePrediction) => void;

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

      // Favorites
      favoriteExperts: [],

      toggleFavoriteExpert: (expertId) => {
        const favorites = get().favoriteExperts;
        if (favorites.includes(expertId)) {
          set({ favoriteExperts: favorites.filter((id) => id !== expertId) });
        } else {
          set({ favoriteExperts: [...favorites, expertId] });
        }
      },

      favoriteMatches: [],

      toggleFavoriteMatch: (match) => {
        const favorites = get().favoriteMatches;
        if (favorites.find((f) => f.id === match.id)) {
          set({ favoriteMatches: favorites.filter((f) => f.id !== match.id) });
        } else {
          set({ favoriteMatches: [...favorites, match] });
        }
      },

      favoritePredictions: [],

      toggleFavoritePrediction: (prediction) => {
        const favorites = get().favoritePredictions;
        if (favorites.find((f) => f.id === prediction.id)) {
          set({ favoritePredictions: favorites.filter((f) => f.id !== prediction.id) });
        } else {
          set({ favoritePredictions: [...favorites, prediction] });
        }
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
          betSlip: [],
          betSlipOpen: false,
          favoriteExperts: [],
          favoriteMatches: [],
          favoritePredictions: [],
          oddsChanges: {},
          subscriptionModalOpen: false,
        });
        // Clear persisted store using Zustand's API to avoid race with persist middleware
        useAppStore.persist.clearStorage();
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
      partialize: (state) => ({
        betSlip: state.betSlip,
        favoriteExperts: state.favoriteExperts,
        favoriteMatches: state.favoriteMatches,
        favoritePredictions: state.favoritePredictions,
        theme: state.theme,
        subscribedExperts: state.subscribedExperts,
      }),
    }
  )
);
