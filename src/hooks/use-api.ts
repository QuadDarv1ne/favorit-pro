import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API response types (Prisma models with relations)
interface ApiMatch {
  id: string;
  sportId: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  drawOdds?: number | null;
  awayOdds: number;
  startTime: string;
  status: string;
  homeScore?: number | null;
  awayScore?: number | null;
  isHot?: boolean;
  sport?: { id: string; name: string; slug: string; icon: string };
  predictions?: Array<{
    id: string;
    prediction: string;
    odds: number;
    confidence: number;
    analysis: string;
    result: string;
    expert?: { id: string; name: string; avatar: string };
  }>;
}

interface ApiExpert {
  id: string;
  name: string;
  avatar: string;
  specialtyId: string;
  winRate: number;
  totalPredictions: number;
  roi: number;
  streak: number;
  lastResults: string; // comma-separated W,L,W,W,L
  bio?: string | null;
  specialty?: { id: string; name: string; slug: string; icon: string };
}

interface ApiPrediction {
  id: string;
  expertId: string;
  matchId: string;
  prediction: string;
  odds: number;
  confidence: number;
  analysis: string;
  result: string;
  createdAt: string;
  expert?: { id: string; name: string; avatar: string };
  match?: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    league: string;
    sport?: { id: string; name: string; slug: string; icon: string };
  };
}

interface ApiNewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  publishedAt: string;
  readTime: number;
}

// API response wrappers
interface MatchesResponse {
  matches: ApiMatch[];
}

interface ExpertsResponse {
  experts: ApiExpert[];
}

interface PredictionsResponse {
  predictions: ApiPrediction[];
}

interface NewsResponse {
  news: ApiNewsArticle[];
}

interface SearchResponse {
  matches: ApiMatch[];
  experts: ApiExpert[];
  predictions: Array<{
    id: string;
    prediction: string;
    odds: number;
    confidence: number;
    result: string;
    expert?: { id: string; name: string; avatar: string };
    match?: { id: string; homeTeam: string; awayTeam: string; league: string; sport?: { id: string; name: string; slug: string; icon: string } };
  }>;
}

// Re-export API types for use in components
export type { ApiMatch, ApiExpert, ApiPrediction, ApiNewsArticle };

// Fetch matches
export function useMatches(status?: string, sportId?: string) {
  return useQuery({
    queryKey: ['matches', status, sportId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (sportId) params.set('sportId', sportId);
      const res = await fetch(`/api/matches?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch matches');
      return res.json() as Promise<MatchesResponse>;
    },
  });
}

// Fetch experts
export function useExperts(sportId?: string) {
  return useQuery({
    queryKey: ['experts', sportId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (sportId) params.set('sportId', sportId);
      const res = await fetch(`/api/experts?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch experts');
      return res.json() as Promise<ExpertsResponse>;
    },
  });
}

// Fetch predictions
export function usePredictions() {
  return useQuery({
    queryKey: ['predictions'],
    queryFn: async () => {
      const res = await fetch('/api/predictions');
      if (!res.ok) throw new Error('Failed to fetch predictions');
      return res.json() as Promise<PredictionsResponse>;
    },
  });
}

// Fetch news
export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json() as Promise<NewsResponse>;
    },
  });
}

// Search
export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json() as Promise<SearchResponse>;
    },
    enabled: query.length >= 2,
  });
}

// Subscribe mutation (server implements toggle: subscribe if not subscribed, unsubscribe if already)
export function useSubscribe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ expertId }: { expertId: string }) => {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId }),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to update subscription' }));
        throw new Error(error.error);
      }
      return res.json() as Promise<{ subscribed: boolean }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experts'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
    },
  });
}
