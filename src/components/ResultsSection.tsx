'use client';

import { finishedMatches, Match } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultsSectionProps {
  onMatchClick?: (match: Match) => void;
}

export function ResultsSection({ onMatchClick }: ResultsSectionProps) {
  const getResultIcon = (confidence: number) => {
    if (confidence >= 70) return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (confidence >= 55) return <MinusCircle className="w-4 h-4 text-yellow-400" />;
    return <XCircle className="w-4 h-4 text-gray-500" />;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">Результаты</h2>
      </div>

      <div className="space-y-3">
        {finishedMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card
              className="bg-gray-800/50 border-gray-700/50 hover:border-gray-600 transition-all cursor-pointer"
              onClick={() => onMatchClick?.(match)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  {/* Date & League */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-28 shrink-0">
                    <span className="text-xs text-gray-500">{match.league}</span>
                    <span className="text-xs text-gray-400">{match.startTime}</span>
                  </div>

                  {/* Teams & Score */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{match.homeTeam}</span>
                      <span className="text-lg font-bold text-white tabular-nums">{match.homeScore ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{match.awayTeam}</span>
                      <span className="text-lg font-bold text-white tabular-nums">{match.awayScore ?? '-'}</span>
                    </div>
                  </div>

                  {/* Prediction result */}
                  {match.prediction && (
                    <div className="flex items-center gap-2 shrink-0">
                      {getResultIcon(match.confidence ?? 0)}
                      <div>
                        <span className="text-xs text-gray-400 block">Прогноз</span>
                        <span className="text-sm font-medium text-emerald-400">{match.prediction}</span>
                      </div>
                    </div>
                  )}

                  {/* Confidence */}
                  <div className="flex flex-col items-end shrink-0">
                    <Badge
                      className={`text-xs ${
                        match.confidence && match.confidence >= 70
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : match.confidence && match.confidence >= 55
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {match.confidence}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
