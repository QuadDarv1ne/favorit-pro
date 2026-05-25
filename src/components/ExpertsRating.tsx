'use client';

import React from 'react';
import { experts, Expert } from '@/lib/data';
import { useExperts, ApiExpert } from '@/hooks/use-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpertsRatingProps {
  detailed?: boolean;
  onExpertClick?: (expert: Expert) => void;
}

function mapApiExpert(e: ApiExpert): Expert {
  return {
    id: e.id,
    name: e.name,
    avatar: e.avatar,
    specialty: e.specialty?.name || e.specialtyId || '',
    winRate: e.winRate,
    totalPredictions: e.totalPredictions,
    roi: e.roi,
    streak: e.streak,
    lastResults: typeof e.lastResults === 'string'
      ? e.lastResults.split(',').filter(Boolean) as ('W' | 'L')[]
      : e.lastResults as ('W' | 'L')[],
    bio: e.bio ?? undefined,
  };
}

export const ExpertsRating = React.memo(function ExpertsRating({ detailed = false, onExpertClick }: ExpertsRatingProps) {
  // React Query hook with fallback to mock data
  const { data } = useExperts();
  const expertsList = (data?.experts?.length ?? 0) > 0
    ? data!.experts.map(mapApiExpert)
    : experts;

  const displayedExperts = detailed ? expertsList : expertsList.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Рейтинг экспертов</h2>
        </div>
        {!detailed && (
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            Все эксперты <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      <div className={`grid gap-4 ${detailed ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {displayedExperts.map((expert, index) => (
          <motion.div
            key={expert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className="bg-gray-800/40 backdrop-blur-md border-gray-700/30 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/5 transition-all duration-300 cursor-pointer group h-full relative overflow-hidden"
              onClick={() => onExpertClick?.(expert)}
            >
              <CardContent className="p-5 relative">
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {expert.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors truncate">
                        {expert.name}
                      </h3>
                      {index < 3 && (
                        <span className="text-yellow-400 text-xs">🏆 #{index + 1}</span>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs mt-1">
                      {expert.specialty}
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-400">{expert.winRate}%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Проход</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{expert.totalPredictions}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Прогнозов</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-400">+{expert.roi}%</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">ROI</p>
                  </div>
                </div>

                {/* Last results */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {expert.lastResults.map((result, i) => (
                      <span
                        key={i}
                        className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                          result === 'W'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{expert.streak} подряд</span>
                  </div>
                </div>

                {detailed && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-yellow-500/50"
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    Подписаться
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
});
