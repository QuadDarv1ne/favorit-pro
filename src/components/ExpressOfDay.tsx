'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Zap, Copy, Check, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const stake = 1000;
const legs = [
  { match: 'Бавария — Дортмунд', prediction: 'П1', odds: 1.55, sport: '⚽', league: 'Бундеслига' },
  { match: 'Реал Мадрид — Ман Сити', prediction: 'Обе забьют', odds: 1.75, sport: '⚽', league: 'Лига Чемпионов' },
  { match: 'Ак Барс — СКА', prediction: 'ТБ 4.5', odds: 1.90, sport: '🏒', league: 'КХЛ' },
  { match: 'Team Spirit — Tundra', prediction: 'П1', odds: 1.65, sport: '🎮', league: 'DreamLeague' },
];

const totalOdds = legs.reduce((acc, leg) => acc * leg.odds, 1);
const potentialWin = Math.round(stake * totalOdds);

export function ExpressOfDay() {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    const text = legs
      .map((l) => `${l.sport} ${l.match} — ${l.prediction} @ ${l.odds}`)
      .join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaceBet = () => {
    toast.info('Экспресс дня', {
      description: `Коэффициент ${totalOdds.toFixed(2)}. Добавьте прогнозы в купон для оформления ставки.`,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-emerald-900/30 via-gray-800/50 to-teal-900/30 border-emerald-500/20 overflow-hidden relative">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

          <CardHeader className="pb-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white">Экспресс дня</CardTitle>
                  <p className="text-xs text-gray-400">Подборка от наших экспертов</p>
                </div>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-sm font-bold px-3">
                <Zap className="w-3.5 h-3.5 mr-1" />
                {totalOdds.toFixed(2)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="relative">
            <div className="space-y-2.5 mb-5">
              {legs.map((leg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30 hover:border-emerald-500/20 transition-colors"
                >
                  <span className="text-lg">{leg.sport}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{leg.match}</p>
                    <p className="text-xs text-gray-500">{leg.league}</p>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs shrink-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {leg.prediction}
                  </Badge>
                  <span className="text-sm font-bold text-emerald-400 shrink-0">{leg.odds.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-400">Общий коэфф.</p>
                  <p className="text-xl font-bold text-emerald-400">{totalOdds.toFixed(2)}</p>
                </div>
                <div className="w-px h-8 bg-gray-700" />
                <div>
                  <p className="text-xs text-gray-400">Ставка</p>
                  <p className="text-xl font-bold text-white">{stake} ₽</p>
                </div>
                <div className="w-px h-8 bg-gray-700" />
                <div>
                  <p className="text-xs text-gray-400">Выигрыш</p>
                  <p className="text-xl font-bold text-emerald-400">{potentialWin} ₽</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handlePlaceBet}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/20"
                >
                  Сделать ставку
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="border-gray-700 text-gray-400 hover:text-white shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
