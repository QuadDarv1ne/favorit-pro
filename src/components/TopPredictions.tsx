'use client';

import React from 'react';
import { topPredictions, Prediction } from '@/lib/data';
import { usePredictions, ApiPrediction } from '@/hooks/use-api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, ChevronRight, ThumbsUp, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfidenceGauge } from '@/components/ConfidenceGauge';
import { PredictionCardSkeleton } from '@/components/Skeletons';

interface TopPredictionsProps {
  onPredictionClick?: (prediction: Prediction) => void;
}

function formatApiCreatedAt(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return createdAt;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} мин назад`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} час${diffHours > 1 ? 'а' : ''} назад`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} дн. назад`;
  } catch {
    return createdAt;
  }
}

function mapApiPrediction(p: ApiPrediction): Prediction {
  return {
    id: p.id,
    expertId: p.expertId,
    expertName: p.expert?.name || '',
    matchId: p.matchId,
    sport: p.match?.sport?.slug || 'football',
    matchTitle: p.match ? `${p.match.homeTeam} — ${p.match.awayTeam}` : '',
    prediction: p.prediction,
    odds: p.odds,
    confidence: p.confidence,
    analysis: p.analysis,
    createdAt: formatApiCreatedAt(p.createdAt),
    result: p.result as Prediction['result'],
  };
}

export const TopPredictions = React.memo(function TopPredictions({ onPredictionClick }: TopPredictionsProps) {
  const { data, isLoading, isError, refetch } = usePredictions();
  const predictionsList = data?.predictions?.length
    ? data.predictions.map(mapApiPrediction)
    : topPredictions;

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Топ прогнозы</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PredictionCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Топ прогнозы</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Ошибка загрузки</h3>
          <p className="text-sm text-gray-400 text-center max-w-sm mb-4">
            Не удалось загрузить прогнозы. Проверьте подключение к интернету.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Повторить
          </Button>
        </div>
      </section>
    );
  }
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Топ прогнозы</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          Все прогнозы <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictionsList.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className="bg-gray-800/40 backdrop-blur-md border-gray-700/30 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer group h-full relative overflow-hidden"
              onClick={() => onPredictionClick?.(prediction)}
            >
              <CardHeader className="pb-2 px-4 pt-4 relative">
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                      {prediction.sport === 'football' ? '⚽ Футбол' : prediction.sport === 'hockey' ? '🏒 Хоккей' : prediction.sport === 'basketball' ? '🏀 Баскетбол' : prediction.sport}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {prediction.createdAt}
                    </div>
                  </div>
                  <ConfidenceGauge value={prediction.confidence} size={40} strokeWidth={3} />
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  {prediction.matchTitle}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-emerald-400 font-bold text-lg">{prediction.prediction}</span>
                  <span className="text-gray-400 text-sm">@ {prediction.odds.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">
                  {prediction.analysis}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {prediction.expertName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs text-gray-400">{prediction.expertName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                    Согласен
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
});
