'use client';

import { useRef } from 'react';
import { upcomingMatches, Match } from '@/lib/data';
import { useMatches, ApiMatch } from '@/hooks/use-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flame, TrendingUp, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore, FavoriteMatch } from '@/stores/app-store';
import { toast } from 'sonner';

interface UpcomingMatchesProps {
  onMatchClick?: (match: Match) => void;
}

function formatApiStartTime(startTime: string): string {
  try {
    const date = new Date(startTime);
    if (isNaN(date.getTime())) return startTime;
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return time;
    if (isTomorrow) return `Завтра ${time}`;
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) + ' ' + time;
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

export function UpcomingMatches({ onMatchClick }: UpcomingMatchesProps) {
  // React Query hook with fallback to mock data
  const { data } = useMatches('upcoming');
  const matches = data?.matches?.length
    ? data.matches.map(mapApiMatch)
    : upcomingMatches;

  const addBet = useAppStore((s) => s.addBet);
  const setBetSlipOpen = useAppStore((s) => s.setBetSlipOpen);
  const toggleFavoriteMatch = useAppStore((s) => s.toggleFavoriteMatch);
  const favoriteMatches = useAppStore((s) => s.favoriteMatches);
  const storeRef = useRef(useAppStore.getState);

  const handleOddsClick = (e: React.MouseEvent, match: Match, type: '1' | 'X' | '2', odds: number) => {
    e.stopPropagation();
    const prediction = type === '1' ? `П1: ${match.homeTeam}` : type === 'X' ? 'Ничья' : `П2: ${match.awayTeam}`;
    const betId = `${match.id}-${type}`;
    addBet({
      id: betId,
      matchTitle: `${match.homeTeam} — ${match.awayTeam}`,
      prediction,
      odds,
      sport: match.sport,
      league: match.league,
    });
    const isInSlip = storeRef.current().betSlip.find((b) => b.id === betId);
    if (!isInSlip) {
      toast.info('Удалено из купона', {
        description: `${match.homeTeam} — ${match.awayTeam}: ${prediction}`,
      });
    } else {
      toast.success('Добавлено в купон', {
        description: `${match.homeTeam} — ${match.awayTeam}: ${prediction} @ ${odds.toFixed(2)}`,
        action: { label: 'Открыть', onClick: () => setBetSlipOpen(true) },
      });
    }
  };

  const handleFavorite = (e: React.MouseEvent, match: Match) => {
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
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-teal-400" />
        <h2 className="text-xl font-bold text-white">Ближайшие матчи</h2>
      </div>

      <div className="space-y-3">
        {matches.map((match, index) => {
          const isFavorite = favoriteMatches.find((f) => f.id === match.id);
          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className="bg-gray-800/50 border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group"
                onClick={() => onMatchClick?.(match)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    {/* League & Time */}
                    <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-28 shrink-0">
                      <span className="text-xs text-gray-500">{match.league}</span>
                      <span className="text-xs text-gray-400 font-medium">{match.startTime}</span>
                    </div>

                    {/* Teams */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                            {match.homeTeam}
                          </span>
                          {match.isHot && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                          {match.awayTeam}
                        </span>
                      </div>
                    </div>

                    {/* Odds - clickable */}
                    <div className="flex gap-2 shrink-0">
                      <div
                        onClick={(e) => handleOddsClick(e, match, '1', match.homeOdds)}
                        className="bg-gray-700/50 hover:bg-emerald-500/20 rounded-lg px-3 py-1.5 text-center min-w-[52px] transition-colors cursor-pointer"
                      >
                        <span className="text-[10px] text-gray-500 block">1</span>
                        <span className="text-sm font-semibold text-emerald-400">{match.homeOdds.toFixed(2)}</span>
                      </div>
                      {match.drawOdds != null && (
                        <div
                          onClick={(e) => { const draw = match.drawOdds; if (draw != null) handleOddsClick(e, match, 'X', draw); }}
                          className="bg-gray-700/50 hover:bg-gray-600/50 rounded-lg px-3 py-1.5 text-center min-w-[52px] transition-colors cursor-pointer"
                        >
                          <span className="text-[10px] text-gray-500 block">X</span>
                          <span className="text-sm font-semibold text-gray-300">{match.drawOdds.toFixed(2)}</span>
                        </div>
                      )}
                      <div
                        onClick={(e) => handleOddsClick(e, match, '2', match.awayOdds)}
                        className="bg-gray-700/50 hover:bg-emerald-500/20 rounded-lg px-3 py-1.5 text-center min-w-[52px] transition-colors cursor-pointer"
                      >
                        <span className="text-[10px] text-gray-500 block">2</span>
                        <span className="text-sm font-semibold text-emerald-400">{match.awayOdds.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Prediction + Favorite */}
                    <div className="flex items-center gap-2 shrink-0">
                      {match.prediction && (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs items-center gap-1 hidden md:flex">
                          <TrendingUp className="w-3 h-3" />
                          {match.prediction}
                        </Badge>
                      )}
                      <button
                        onClick={(e) => handleFavorite(e, match)}
                        className={`p-1.5 rounded-lg transition-colors ${isFavorite ? 'text-red-400 bg-red-500/10' : 'text-gray-600 hover:text-red-400 hover:bg-gray-700/50'}`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
