'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearch } from '@/hooks/use-api';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, TrendingUp, Trophy, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  matches: Array<{
    id: string;
    homeTeam: string;
    awayTeam: string;
    league: string;
    status: string;
    sport: { name: string; icon: string };
  }>;
  experts: Array<{
    id: string;
    name: string;
    avatar: string;
    winRate: number;
    specialty: { name: string };
  }>;
  predictions: Array<{
    id: string;
    prediction: string;
    odds: number;
    confidence: number;
    expert: { name: string };
    match: { homeTeam: string; awayTeam: string };
  }>;
}

interface SearchBarProps {
  onMatchClick?: (match: SearchResult['matches'][0]) => void;
  autoFocus?: boolean;
}

export function SearchBar({ onMatchClick, autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [dismissedQuery, setDismissedQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // React Query search hook (only fires when debouncedQuery >= 2 chars)
  const { data, isFetching } = useSearch(debouncedQuery);

  // Map API data to SearchResult format (memoized)
  const results: SearchResult | null = useMemo(() => data ? {
    matches: data.matches.map(m => ({
      id: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      league: m.league,
      status: m.status,
      sport: m.sport ? { name: m.sport.name, icon: m.sport.icon } : { name: '', icon: '' },
    })),
    experts: data.experts.map(e => ({
      id: e.id,
      name: e.name,
      avatar: e.avatar,
      winRate: e.winRate,
      specialty: e.specialty ? { name: e.specialty.name } : { name: '' },
    })),
    predictions: data.predictions.map(p => ({
      id: p.id,
      prediction: p.prediction,
      odds: p.odds,
      confidence: p.confidence,
      expert: p.expert ? { name: p.expert.name } : { name: '' },
      match: p.match ? { homeTeam: p.match.homeTeam, awayTeam: p.match.awayTeam } : { homeTeam: '', awayTeam: '' },
    })),
  } : null, [data]);

  const hasResults = results !== null && (
    results.matches.length > 0 || results.experts.length > 0 || results.predictions.length > 0
  );

  // Dropdown visibility: show when there are results and query is valid and not dismissed
  const isOpen = hasResults && query.length >= 2 && query !== dismissedQuery;

  // Track current query in ref for click-outside handler
  const queryRef = useRef(query);
  useEffect(() => { queryRef.current = query; }, [query]);

  // Handle click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDismissedQuery(queryRef.current);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Поиск матчей, экспертов, прогнозов..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Clear dismissed state when typing
            if (dismissedQuery) setDismissedQuery('');
          }}
          onFocus={() => {
            // Re-show dropdown on focus if it was dismissed
            if (dismissedQuery) setDismissedQuery('');
          }}
          className="bg-gray-800/50 border-gray-700/50 text-white pl-10 pr-8 placeholder:text-gray-500 focus:border-emerald-500/50"
          autoFocus={autoFocus}
        />
        {query && (
          <button
            aria-label="Очистить поиск"
            onClick={() => { setQuery(''); setDebouncedQuery(''); setDismissedQuery(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isFetching && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#151b23] border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 z-50 max-h-[400px] overflow-y-auto"
          >
            {/* Matches */}
            {results && results.matches.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Матчи</span>
                </div>
                {results.matches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => {
                      onMatchClick?.(match);
                      setDismissedQuery(query);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{match.sport.icon}</span>
                      <span className="text-sm text-white">{match.homeTeam} — {match.awayTeam}</span>
                    </div>
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-[10px]">
                      {match.league}
                    </Badge>
                  </button>
                ))}
              </div>
            )}

            {/* Experts */}
            {results && results.experts.length > 0 && (
              <div className="p-3 border-t border-gray-700/50">
                <div className="flex items-center gap-1.5 mb-2">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Эксперты</span>
                </div>
                {results.experts.map((expert) => (
                  <div
                    key={expert.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {expert.avatar}
                      </div>
                      <span className="text-sm text-white">{expert.name}</span>
                    </div>
                    <span className="text-xs text-emerald-400">{expert.winRate}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Predictions */}
            {results && results.predictions.length > 0 && (
              <div className="p-3 border-t border-gray-700/50">
                <div className="flex items-center gap-1.5 mb-2">
                  <Newspaper className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Прогнозы</span>
                </div>
                {results.predictions.map((pred) => (
                  <div
                    key={pred.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div>
                      <span className="text-sm text-emerald-400 font-medium">{pred.prediction}</span>
                      <span className="text-xs text-gray-500 ml-2">{pred.match.homeTeam} — {pred.match.awayTeam}</span>
                    </div>
                    <span className="text-xs text-gray-400">{pred.odds}</span>
                  </div>
                ))}
              </div>
            )}

            {!hasResults && query.length >= 2 && (
              <div className="p-6 text-center text-sm text-gray-500">
                Ничего не найдено по запросу «{query}»
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
