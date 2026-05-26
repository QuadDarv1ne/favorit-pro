'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { liveMatches, Match } from '@/lib/data';
import { useMatches, ApiMatch } from '@/hooks/use-api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Radio, TrendingUp, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore, FavoriteMatch } from '@/stores/app-store';
import { toast } from 'sonner';
import { AnimatedOdds } from '@/components/AnimatedOdds';

interface LiveMatchesProps {
  onMatchClick?: (match: Match) => void;
}

interface OddsState {
  home: number;
  draw?: number;
  away: number;
  homeDirection: 'up' | 'down' | null;
  awayDirection: 'up' | 'down' | null;
  drawDirection: 'up' | 'down' | null;
}

function formatApiStartTime(startTime: string): string {
  try {
    const date = new Date(startTime);
    if (isNaN(date.getTime())) return startTime;
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return startTime;
  }
}

function mapApiMatch(m: ApiMatch): Match {
  return {
    id: m.id,
    sport: m.sport?.slug || m.sportId || 'football',
    league: m.league,
    homeTeam: m.homeTeam,
    awayTeam: m.awayTeam,
    homeOdds: m.homeOdds,
    drawOdds: m.drawOdds ?? undefined,
    awayOdds: m.awayOdds,
    startTime: formatApiStartTime(m.startTime),
    status: m.status as Match['status'],
    homeScore: m.homeScore ?? undefined,
    awayScore: m.awayScore ?? undefined,
    prediction: m.predictions?.[0]?.prediction,
    confidence: m.predictions?.[0]?.confidence,
    isHot: m.isHot,
  };
}

export const LiveMatches = React.memo(function LiveMatches({ onMatchClick }: LiveMatchesProps) {
  const addBet = useAppStore((s) => s.addBet);
  const setBetSlipOpen = useAppStore((s) => s.setBetSlipOpen);
  const toggleFavoriteMatch = useAppStore((s) => s.toggleFavoriteMatch);
  const favoriteMatches = useAppStore((s) => s.favoriteMatches);
  const storeRef = useRef(useAppStore.getState);

  // React Query hook with fallback to mock data
  const { data } = useMatches('live');
  const matches = data?.matches?.length
    ? data.matches.map(mapApiMatch)
    : liveMatches;

  // Ref for simulation effects to always see current matches
  const matchesRef = useRef(matches);
  useEffect(() => { matchesRef.current = matches; }, [matches]);

  // Compute initial odds and scores for the first render
  const initialOdds: Record<string, OddsState> = useMemo(() => {
    const initial: Record<string, OddsState> = {};
    matches.forEach(m => {
      initial[m.id] = {
        home: m.homeOdds,
        draw: m.drawOdds,
        away: m.awayOdds,
        homeDirection: null,
        awayDirection: null,
        drawDirection: null,
      };
    });
    return initial;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only for first render

  const initialScores: Record<string, { home: number; away: number }> = useMemo(() => {
    const initial: Record<string, { home: number; away: number }> = {};
    matches.forEach(m => {
      initial[m.id] = { home: m.homeScore ?? 0, away: m.awayScore ?? 0 };
    });
    return initial;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only for first render

  // Use refs instead of useState so we can sync when matches change.
  // useState(initialOdds) only uses the initial value on first render,
  // so new matches would never get odds/scores entries.
  const matchOddsMapRef = useRef<Record<string, OddsState>>(initialOdds);
  const matchScoresRef = useRef<Record<string, { home: number; away: number }>>(initialScores);
  const [, forceUpdate] = useState(0);

  // Track pending timeouts for cleanup
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Sync refs when matches change (new matches arrive, old ones leave)
  useEffect(() => {
    const newOdds: Record<string, OddsState> = {};
    const newScores: Record<string, { home: number; away: number }> = {};
    matches.forEach(m => {
      // Preserve existing odds/scores for still-present matches
      newOdds[m.id] = matchOddsMapRef.current[m.id] ?? {
        home: m.homeOdds,
        draw: m.drawOdds,
        away: m.awayOdds,
        homeDirection: null,
        awayDirection: null,
        drawDirection: null,
      };
      newScores[m.id] = matchScoresRef.current[m.id] ?? { home: m.homeScore ?? 0, away: m.awayScore ?? 0 };
    });
    matchOddsMapRef.current = newOdds;
    matchScoresRef.current = newScores;
    forceUpdate(n => n + 1);
  }, [matches]);

  // Simulate live odds changes
  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current;
    const currentMatches = matchesRef.current.filter(m => m.status === 'live');
    if (currentMatches.length === 0) return;

    const interval = setInterval(() => {
      const prev = matchOddsMapRef.current;
      const updated = { ...prev };
      const matchIndex = Math.floor(Math.random() * currentMatches.length);
      const match = currentMatches[matchIndex];
      if (!match) return;
      const field = Math.random() > 0.5 ? 'home' : 'away';
      const currentOdds = prev[match.id]?.[field] || match[field === 'home' ? 'homeOdds' : 'awayOdds'];
      const change = (Math.random() - 0.5) * 0.2;
      const newOdds = Math.max(1.01, parseFloat((currentOdds + change).toFixed(2)));
      const direction: 'up' | 'down' = newOdds > currentOdds ? 'up' : 'down';

      if (updated[match.id]) {
        updated[match.id] = {
          ...updated[match.id],
          [field]: newOdds,
          [`${field}Direction`]: direction,
        };
      }

      matchOddsMapRef.current = updated;
      forceUpdate(n => n + 1);

      // Clear direction after 3 seconds
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId);
        const current = matchOddsMapRef.current;
        if (current[match.id]) {
          matchOddsMapRef.current = {
            ...current,
            [match.id]: {
              ...current[match.id],
              [`${field}Direction`]: null,
            },
          };
          forceUpdate(n => n + 1);
        }
      }, 3000);
      timeoutIds.add(timeoutId);
    }, 5000);

    return () => {
      clearInterval(interval);
      const timeouts = Array.from(timeoutIds);
      timeouts.forEach(clearTimeout);
      timeoutIds.clear();
    };
  }, []);

  // Simulate occasional score changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const currentMatches = matchesRef.current.filter(m => m.status === 'live');
        if (currentMatches.length === 0) return;
        const prev = matchScoresRef.current;
        const updated = { ...prev };
        const matchIndex = Math.floor(Math.random() * currentMatches.length);
        const match = currentMatches[matchIndex];
        if (!match) return;
        const team = Math.random() > 0.5 ? 'home' : 'away';
        updated[match.id] = {
          ...updated[match.id],
          [team]: (updated[match.id]?.[team] ?? match[team === 'home' ? 'homeScore' : 'awayScore'] ?? 0) + 1,
        };
        matchScoresRef.current = updated;
        forceUpdate(n => n + 1);
        const teamName = team === 'home' ? match.homeTeam : match.awayTeam;
        toast.success(`Гол! ${teamName} забивает!`, {
          description: `${match.homeTeam} ${updated[match.id].home} : ${updated[match.id].away} ${match.awayTeam}`,
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleOddsClick = (e: React.MouseEvent, match: Match, type: '1' | 'X' | '2', odds: number) => {
    e.stopPropagation();
    const prediction = type === '1' ? `П1: ${match.homeTeam}` : type === 'X' ? 'Ничья' : `П2: ${match.awayTeam}`;
    const betId = `${match.id}-${type}`;
    const wasInSlip = storeRef.current().betSlip.some((b) => b.id === betId);
    addBet({
      id: betId,
      matchTitle: `${match.homeTeam} — ${match.awayTeam}`,
      prediction,
      odds,
      sport: match.sport,
      league: match.league,
    });
    if (wasInSlip) {
      toast.info('Удалено из купона', {
        description: `${match.homeTeam} — ${match.awayTeam}: ${prediction}`,
      });
    } else {
      toast.success('Добавлено в купон', {
        description: `${match.homeTeam} — ${match.awayTeam}: ${prediction} @ ${odds.toFixed(2)}`,
        action: {
          label: 'Открыть',
          onClick: () => setBetSlipOpen(true),
        },
      });
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, match: Match) => {
    e.stopPropagation();
    const favMatch: FavoriteMatch = {
      id: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      sport: match.sport,
      startTime: match.startTime,
    };
    toggleFavoriteMatch(favMatch);
    const isFav = storeRef.current().favoriteMatches.find((f) => f.id === match.id);
    toast[isFav ? 'success' : 'info'](isFav ? 'Добавлено в избранное' : 'Удалено из избранного', {
      description: `${match.homeTeam} — ${match.awayTeam}`,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-red-400 animate-pulse" />
          <h2 className="text-xl font-bold text-white">Живые матчи</h2>
        </div>
        <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
          LIVE
        </Badge>
      </div>

      <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-4 lg:pb-0 snap-carousel">
        {matches.map((match, index) => {
          const currentOdds = matchOddsMapRef.current[match.id] || {
            home: match.homeOdds, draw: match.drawOdds, away: match.awayOdds,
            homeDirection: null, awayDirection: null, drawDirection: null,
          };
          const currentScore = matchScoresRef.current[match.id] || { home: match.homeScore ?? 0, away: match.awayScore ?? 0 };
          const isFavorite = favoriteMatches.find((f) => f.id === match.id);

          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="min-w-[300px] lg:min-w-0 snap-start"
            >
              <Card
                className="bg-gray-800/40 backdrop-blur-md border-gray-700/30 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => onMatchClick?.(match)}
              >
                <CardContent className="p-4 relative">
                  {/* Gradient overlay at top */}
                  <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{match.league}</span>
                      {match.isHot && (
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleFavoriteClick(e, match)}
                        className={`p-1 rounded transition-colors ${isFavorite ? 'text-red-400' : 'text-gray-600 hover:text-red-400'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      {match.status === 'live' ? (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-xs text-red-400 font-medium">LIVE</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 tabular-nums">{match.startTime}</span>
                      )}
                    </div>
                  </div>

                  {/* Teams & Score */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                        {match.homeTeam}
                      </span>
                      <motion.span
                        key={`home-${currentScore.home}`}
                        initial={{ scale: 1.3, color: '#10b981' }}
                        animate={{ scale: 1, color: '#ffffff' }}
                        transition={{ duration: 0.5 }}
                        className="text-lg font-bold text-white tabular-nums"
                      >
                        {currentScore.home}
                      </motion.span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                        {match.awayTeam}
                      </span>
                      <motion.span
                        key={`away-${currentScore.away}`}
                        initial={{ scale: 1.3, color: '#10b981' }}
                        animate={{ scale: 1, color: '#ffffff' }}
                        transition={{ duration: 0.5 }}
                        className="text-lg font-bold text-white tabular-nums"
                      >
                        {currentScore.away}
                      </motion.span>
                    </div>
                  </div>

                  {/* Odds - clickable with animated changes */}
                  <div className="flex gap-2 mb-3" role="group" aria-label="Коэффициенты ставок">
                    <button
                      type="button"
                      aria-label={`Ставка на победу ${match.homeTeam}, коэффициент ${currentOdds.home.toFixed(2)}`}
                      onClick={(e) => handleOddsClick(e, match, '1', currentOdds.home)}
                      className="rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#0d1117]"
                    >
                      <AnimatedOdds odds={currentOdds.home} direction={currentOdds.homeDirection} />
                    </button>
                    {currentOdds.draw != null && (
                      <button
                        type="button"
                        aria-label={`Ставка на ничью, коэффициент ${currentOdds.draw.toFixed(2)}`}
                        onClick={(e) => { const draw = currentOdds.draw; if (draw != null) handleOddsClick(e, match, 'X', draw); }}
                        className="rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#0d1117]"
                      >
                        <AnimatedOdds odds={currentOdds.draw} direction={currentOdds.drawDirection} />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={`Ставка на победу ${match.awayTeam}, коэффициент ${currentOdds.away.toFixed(2)}`}
                      onClick={(e) => handleOddsClick(e, match, '2', currentOdds.away)}
                      className="rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#0d1117]"
                    >
                      <AnimatedOdds odds={currentOdds.away} direction={currentOdds.awayDirection} />
                    </button>
                  </div>

                  {/* Prediction */}
                  {match.prediction && (
                    <div className="flex items-center justify-between bg-emerald-500/10 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">{match.prediction}</span>
                      </div>
                      <span className="text-xs text-emerald-300 font-medium">{match.confidence}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});
