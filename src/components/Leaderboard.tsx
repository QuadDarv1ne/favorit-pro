'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, TrendingUp, Crown, Star, Zap, BarChart3, Users, ChevronUp, ChevronDown, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  winRate: number;
  totalBets: number;
  profit: number;
  roi: number;
  streak: number;
  tier: 'free' | 'pro' | 'vip';
  weeklyChange: number;
}

const leaderboardData: LeaderboardUser[] = [
  { id: '1', rank: 1, name: 'Виктор Про', avatar: 'ВП', winRate: 82, totalBets: 234, profit: 87500, roi: 34.2, streak: 12, tier: 'vip', weeklyChange: 0 },
  { id: '2', rank: 2, name: 'Анна Ставкина', avatar: 'АС', winRate: 79, totalBets: 189, profit: 62300, roi: 28.7, streak: 8, tier: 'vip', weeklyChange: 2 },
  { id: '3', rank: 3, name: 'Михаил Аналитик', avatar: 'МА', winRate: 77, totalBets: 312, profit: 58900, roi: 25.1, streak: 5, tier: 'pro', weeklyChange: -1 },
  { id: '4', rank: 4, name: 'Олег Каппер', avatar: 'ОК', winRate: 75, totalBets: 198, profit: 45600, roi: 22.3, streak: 6, tier: 'pro', weeklyChange: 1 },
  { id: '5', rank: 5, name: 'Елена Фаворит', avatar: 'ЕФ', winRate: 74, totalBets: 156, profit: 38200, roi: 19.8, streak: 4, tier: 'pro', weeklyChange: 3 },
  { id: '6', rank: 6, name: 'Дмитрий Про', avatar: 'ДП', winRate: 72, totalBets: 267, profit: 31400, roi: 17.5, streak: 3, tier: 'pro', weeklyChange: -2 },
  { id: '7', rank: 7, name: 'Светлана Теннис', avatar: 'СТ', winRate: 71, totalBets: 145, profit: 28900, roi: 16.2, streak: 7, tier: 'free', weeklyChange: 0 },
  { id: '8', rank: 8, name: 'Игорь Хоккей', avatar: 'ИХ', winRate: 69, totalBets: 203, profit: 22100, roi: 14.8, streak: 2, tier: 'free', weeklyChange: -1 },
  { id: '9', rank: 9, name: 'Наталья Баскет', avatar: 'НБ', winRate: 68, totalBets: 178, profit: 18600, roi: 12.4, streak: 3, tier: 'free', weeklyChange: 2 },
  { id: '10', rank: 10, name: 'Алексей Новичок', avatar: 'АН', winRate: 65, totalBets: 89, profit: 12400, roi: 9.7, streak: 1, tier: 'free', weeklyChange: -3 },
];

const tierConfig = {
  vip: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: <Crown className="w-3 h-3" /> },
  pro: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: <Star className="w-3 h-3" /> },
  free: { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30', icon: <Zap className="w-3 h-3" /> },
};

const rankConfig: Record<number, { color: string; bg: string; icon: React.ReactNode }> = {
  1: { color: 'text-yellow-400', bg: 'bg-gradient-to-br from-yellow-500/30 to-amber-500/20', icon: <Trophy className="w-5 h-5" /> },
  2: { color: 'text-gray-300', bg: 'bg-gradient-to-br from-gray-400/20 to-gray-500/10', icon: <Medal className="w-5 h-5" /> },
  3: { color: 'text-orange-400', bg: 'bg-gradient-to-br from-orange-500/20 to-amber-600/10', icon: <Medal className="w-5 h-5" /> },
};

export function Leaderboard() {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month');

  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Лидерборд</h2>
        </div>
        <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
          {(['week', 'month', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Всё время'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {top3.map((user) => {
          const config = rankConfig[user.rank] || { color: 'text-gray-400', bg: 'bg-gray-800/50', icon: null };
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (user.rank - 1) * 0.15 }}
              className={`${config.bg} rounded-xl border border-gray-700/30 p-4 text-center relative overflow-hidden ${user.rank === 1 ? 'ring-2 ring-yellow-500/30 sm:scale-105' : ''}`}
            >
              {user.rank === 1 && (
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none" />
              )}
              <div className="relative">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-2 ${
                  user.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/20' :
                  user.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                  'bg-gradient-to-br from-orange-500 to-amber-600 text-white'
                }`}>
                  {user.avatar}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {config.icon}
                  <span className={`text-xs font-bold ${config.color}`}>#{user.rank}</span>
                </div>
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <Badge className={`${tierConfig[user.tier].bg} ${tierConfig[user.tier].color} border ${tierConfig[user.tier].border} text-[10px] mt-1`}>
                  {tierConfig[user.tier].icon}
                  <span className="ml-1">{user.tier.toUpperCase()}</span>
                </Badge>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Проход</span>
                    <span className="text-emerald-400 font-medium">{user.winRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Прибыль</span>
                    <span className="text-emerald-400 font-medium">+{(user.profit / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">ROI</span>
                    <span className="text-teal-400 font-medium">+{user.roi}%</span>
                  </div>
                </div>
                {user.streak >= 5 && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-[10px] text-orange-400 font-medium">{user.streak} серия</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="space-y-2">
        {rest.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="bg-gray-800/40 border-gray-700/30 hover:border-gray-600/50 transition-all">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <span className="text-sm font-bold text-gray-400 w-6 text-center">{user.rank}</span>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs font-bold text-white">
                    {user.avatar}
                  </div>

                  {/* Name & tier */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <Badge className={`${tierConfig[user.tier].bg} ${tierConfig[user.tier].color} border ${tierConfig[user.tier].border} text-[9px] px-1.5 py-0`}>
                        {tierConfig[user.tier].icon}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>{user.totalBets} ставок</span>
                      <span className="flex items-center gap-0.5">
                        {user.weeklyChange > 0 ? <ChevronUp className="w-3 h-3 text-emerald-400" /> :
                         user.weeklyChange < 0 ? <ChevronDown className="w-3 h-3 text-red-400" /> : null}
                        {user.weeklyChange !== 0 && (
                          <span className={user.weeklyChange > 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {Math.abs(user.weeklyChange)}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <div className="text-center">
                      <p className="text-gray-500">Проход</p>
                      <p className="text-emerald-400 font-bold">{user.winRate}%</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-gray-500">ROI</p>
                      <p className="text-teal-400 font-bold">+{user.roi}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Прибыль</p>
                      <p className="text-white font-bold">+{(user.profit / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats footer */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/30 text-center">
          <BarChart3 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-white">2,847</p>
          <p className="text-[10px] text-gray-500">Участников</p>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/30 text-center">
          <TrendingUp className="w-5 h-5 text-teal-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-white">+17.3%</p>
          <p className="text-[10px] text-gray-500">Средний ROI</p>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/30 text-center">
          <Users className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-white">1.2M ₽</p>
          <p className="text-[10px] text-gray-500">Общий профит</p>
        </div>
      </div>
    </section>
  );
}
