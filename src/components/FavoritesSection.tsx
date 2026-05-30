'use client';

import React from 'react';
import { useFavoritesDetail, useSyncFavorites, ApiMatch, ApiExpert, ApiPrediction } from '@/hooks/use-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, TrendingUp, Trash2, Users, Radio, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FavoritesSectionProps {
  onMatchClick?: (match: ApiMatch) => void;
  onExpertClick?: (expert: ApiExpert) => void;
  onPredictionClick?: (prediction: ApiPrediction) => void;
}

const sportEmoji = (sport: string) =>
  sport === 'football' ? '⚽' : sport === 'hockey' ? '🏒' : sport === 'basketball' ? '🏀' : sport === 'tennis' ? '🎾' : '🎮';

function formatStartTime(startTime: string): string {
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

export const FavoritesSection = React.memo(function FavoritesSection({ onMatchClick, onExpertClick, onPredictionClick }: FavoritesSectionProps) {
  const { favorites, isLoading } = useFavoritesDetail();
  const { toggleExpert, toggleMatch, togglePrediction } = useSyncFavorites();

  const { matches, experts, predictions } = favorites;

  const handleRemoveMatch = (match: ApiMatch) => {
    toggleMatch(match.id);
    toast.info('Удалено из избранного', { description: `${match.homeTeam} — ${match.awayTeam}` });
  };

  const handleRemoveExpert = (expertId: string) => {
    toggleExpert(expertId);
    const expert = experts.find((e) => e.id === expertId);
    toast.info('Удалено из избранного', { description: expert?.name });
  };

  const handleRemovePrediction = (pred: ApiPrediction) => {
    togglePrediction(pred.id);
    toast.info('Удалено из избранного', { description: pred.match?.homeTeam ? `${pred.match.homeTeam} — ${pred.match.awayTeam}` : pred.prediction });
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-gray-600 animate-pulse" />
          </div>
          <p className="text-sm text-gray-400">Загрузка избранного...</p>
        </div>
      </section>
    );
  }

  const totalFavorites = matches.length + experts.length + predictions.length;

  if (totalFavorites === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Нет избранного</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            Нажмите <Heart className="w-3.5 h-3.5 inline text-red-400" /> на матче, эксперте или прогнозе, чтобы сохранить его в избранное
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-5 h-5 text-red-400 fill-current" />
        <h2 className="text-xl font-bold text-white">Избранное</h2>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
          {totalFavorites}
        </Badge>
      </div>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="bg-gray-800/50 border-gray-700/50 mb-4">
          <TabsTrigger value="matches" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            Матчи
            {matches.length > 0 && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full">{matches.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="experts" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Эксперты
            {experts.length > 0 && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full">{experts.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="predictions" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Прогнозы
            {predictions.length > 0 && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full">{predictions.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Favorite Matches */}
        <TabsContent value="matches">
          {matches.length === 0 ? (
            <EmptyTab icon={<Radio className="w-8 h-8" />} text="Нет матчей в избранном" />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {matches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card
                      className="bg-gray-800/40 backdrop-blur-md border-gray-700/30 hover:border-emerald-500/40 transition-all cursor-pointer group"
                      onClick={() => onMatchClick?.(match)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-500">{sportEmoji(match.sport?.slug ?? '')} {match.league}</span>
                              {match.status === 'live' && (
                                <span className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                              {match.homeTeam} — {match.awayTeam}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatStartTime(match.startTime)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right text-sm">
                              <span className="text-gray-400">1</span>{' '}
                              <span className="text-emerald-400 font-medium">{match.homeOdds?.toFixed(2)}</span>
                              {match.awayOdds && (
                                <>
                                  {' '}<span className="text-gray-400">2</span>{' '}
                                  <span className="text-emerald-400 font-medium">{match.awayOdds.toFixed(2)}</span>
                                </>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleRemoveMatch(match); }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        {/* Favorite Experts */}
        <TabsContent value="experts">
          {experts.length === 0 ? (
            <EmptyTab icon={<Users className="w-8 h-8" />} text="Нет экспертов в избранном" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {experts.map((expert, index) => (
                  <motion.div
                    key={expert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card
                      className="bg-gray-800/40 backdrop-blur-md border-gray-700/30 hover:border-emerald-500/40 transition-all cursor-pointer group"
                      onClick={() => onExpertClick?.(expert)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-yellow-500/20">
                              {expert.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">{expert.name}</p>
                              <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-[10px] mt-0.5">{expert.specialty?.name}</Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleRemoveExpert(expert.id); }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                            <p className="text-xs text-gray-500">Проход</p>
                            <p className="text-sm font-bold text-emerald-400">{expert.winRate}%</p>
                          </div>
                          <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                            <p className="text-xs text-gray-500">ROI</p>
                            <p className="text-sm font-bold text-teal-400">+{expert.roi}%</p>
                          </div>
                          <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                            <p className="text-xs text-gray-500">Серия</p>
                            <p className="text-sm font-bold text-yellow-400">{expert.streak}W</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        {/* Favorite Predictions */}
        <TabsContent value="predictions">
          {predictions.length === 0 ? (
            <EmptyTab icon={<TrendingUp className="w-8 h-8" />} text="Нет прогнозов в избранном" />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {predictions.map((pred, index) => (
                  <motion.div
                    key={pred.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card
                      className="bg-gray-800/40 backdrop-blur-md border-gray-700/30 hover:border-emerald-500/40 transition-all cursor-pointer group"
                      onClick={() => onPredictionClick?.(pred)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                              {pred.match ? `${pred.match.homeTeam} — ${pred.match.awayTeam}` : pred.prediction}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-emerald-400 font-bold">{pred.prediction}</span>
                              <span className="text-gray-400 text-sm">@ {pred.odds?.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{pred.expert?.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleRemovePrediction(pred); }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
});

function EmptyTab({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-600 mb-3">
        {icon}
      </div>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
