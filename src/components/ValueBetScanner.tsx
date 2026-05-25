'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Radar, ArrowUpDown, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const valueBets = [
  { id: 'vb1', match: 'Реал Мадрид — Ман Сити', sport: 'football', prediction: 'П1', bookmakerOdds: 2.40, fairOdds: 2.10, value: 14.3, confidence: 72, league: 'ЛЧ' },
  { id: 'vb2', match: 'Бавария — Дортмунд', sport: 'football', prediction: 'ТБ 2.5', bookmakerOdds: 1.85, fairOdds: 1.65, value: 12.1, confidence: 68, league: 'Бундеслига' },
  { id: 'vb3', match: 'Ак Барс — СКА', sport: 'hockey', prediction: 'ТБ 4.5', bookmakerOdds: 1.90, fairOdds: 1.72, value: 10.5, confidence: 65, league: 'КХЛ' },
  { id: 'vb4', match: 'ЦСКА М — Химки', sport: 'basketball', prediction: 'Ф1(-8.5)', bookmakerOdds: 1.85, fairOdds: 1.65, value: 12.1, confidence: 74, league: 'Единая Лига ВТБ' },
  { id: 'vb5', match: 'Интер — Ювентус', sport: 'football', prediction: 'Обе забьют', bookmakerOdds: 1.95, fairOdds: 1.75, value: 11.4, confidence: 70, league: 'Серия А' },
  { id: 'vb6', match: 'Team Spirit — Tundra', sport: 'cybersport', prediction: 'П1', bookmakerOdds: 1.65, fairOdds: 1.50, value: 10.0, confidence: 62, league: 'DreamLeague' },
];

function ValueGauge({ value, size = 56 }: { value: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 20) * circumference; // scale: 20% = full
  const color = value > 10 ? '#10b981' : '#eab308';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-white font-bold text-xs tabular-nums">{value}%</span>
      </div>
    </div>
  );
}

function SportIcon({ sport }: { sport: string }) {
  const icons: Record<string, string> = {
    football: '⚽',
    hockey: '🏒',
    basketball: '🏀',
    tennis: '🎾',
    cybersport: '🎮',
  };
  return <span>{icons[sport] || '🏅'}</span>;
}

export function ValueBetScanner() {
  const [sortBy, setSortBy] = useState<'value' | 'confidence'>('value');

  const sorted = [...valueBets].sort((a, b) =>
    sortBy === 'value' ? b.value - a.value : b.confidence - a.confidence
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Radar className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">ValueBet Сканер</h2>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-2">
                Поиск ценности
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Ставки с перевесом над линией букмекера</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={() => setSortBy(sortBy === 'value' ? 'confidence' : 'value')}
        >
          <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
          {sortBy === 'value' ? 'По Value%' : 'По Увер.%'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((bet, index) => (
          <motion.div
            key={bet.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
          >
            <Card
              className={`bg-gray-800/40 backdrop-blur-md border-gray-700/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden cursor-pointer group`}
              style={{ borderLeftWidth: '3px', borderLeftColor: bet.value > 10 ? '#10b981' : '#eab308' }}
            >
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

              <CardContent className="p-4">
                {/* Header: match info + gauge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <SportIcon sport={bet.sport} />
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-400 text-[10px] px-1.5 py-0">
                        {bet.league}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {bet.match}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold text-sm">{bet.prediction}</span>
                    </div>
                  </div>
                  <ValueGauge value={bet.value} size={56} />
                </div>

                {/* Odds comparison */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-900/50 rounded-lg p-2.5 text-center border border-gray-700/30">
                    <p className="text-[10px] text-gray-500 mb-0.5">Коэфф. БК</p>
                    <p className="text-white font-bold tabular-nums">{bet.bookmakerOdds.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-2.5 text-center border border-gray-700/30">
                    <p className="text-[10px] text-gray-500 mb-0.5">Справедл. коэфф.</p>
                    <p className="text-gray-400 font-bold tabular-nums">{bet.fairOdds.toFixed(2)}</p>
                  </div>
                </div>

                {/* Value badge + confidence bar */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={`text-[10px] px-2 border ${
                      bet.value > 10
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}
                  >
                    +{bet.value}% value
                  </Badge>
                  <div className="flex items-center gap-2 flex-1 ml-3">
                    <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          bet.confidence > 70 ? 'bg-emerald-500' : bet.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${bet.confidence}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 tabular-nums min-w-[28px] text-right">{bet.confidence}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          Все value-ставки <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </section>
  );
}
