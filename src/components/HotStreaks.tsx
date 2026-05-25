'use client';

import React from 'react';
import { experts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const hotExperts = experts.filter((e) => e.streak >= 3);

const gradientColors: Record<string, string> = {
  'Футбол': 'from-orange-500 to-red-600',
  'Хоккей': 'from-cyan-500 to-blue-600',
  'Теннис': 'from-yellow-500 to-amber-600',
  'Киберспорт': 'from-purple-500 to-violet-600',
  'Баскетбол': 'from-orange-400 to-rose-600',
};

export const HotStreaks = React.memo(function HotStreaks() {
  if (hotExperts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-bold text-white">Горячие серии</h2>
        </div>
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
          🔥 {hotExperts.length} экспертов
        </Badge>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 snap-carousel">
        {hotExperts.map((expert, index) => {
          const gradient = gradientColors[expert.specialty] || 'from-orange-500 to-red-600';
          const winsInStreak = expert.lastResults.filter((r) => r === 'W').length;
          const winRateInStreak = Math.round((winsInStreak / expert.lastResults.length) * 100);

          return (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="min-w-[260px] sm:min-w-[280px] snap-start"
            >
              <div className="glass-card rounded-xl p-4 fire-glow relative overflow-hidden group hover:border-orange-500/40 transition-all duration-300 card-lift">
                {/* Gradient overlay at top */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  {/* Expert header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg`}
                    >
                      {expert.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors truncate">
                        {expert.name}
                      </h3>
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-[10px] mt-0.5">
                        {expert.specialty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Flame className="w-4 h-4" />
                      <span className="text-lg font-bold">{expert.streak}</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="text-center bg-gray-900/30 rounded-lg py-2 px-1">
                      <p className="text-sm font-bold text-emerald-400">{expert.winRate}%</p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">Проход</p>
                    </div>
                    <div className="text-center bg-gray-900/30 rounded-lg py-2 px-1">
                      <p className="text-sm font-bold text-orange-400">+{expert.roi}%</p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">ROI</p>
                    </div>
                  </div>

                  {/* Last results */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {expert.lastResults.map((result, i) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                            result === 'W'
                              ? 'bg-emerald-500/25 text-emerald-400'
                              : 'bg-red-500/25 text-red-400'
                          }`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <TrendingUp className="w-3 h-3 text-orange-400" />
                      <span>{winRateInStreak}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});
