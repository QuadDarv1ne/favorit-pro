'use client';

import { Badge } from '@/components/ui/badge';
import { Trophy, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  unlocked: boolean;
  date?: string;
}

const achievements: Achievement[] = [
  {
    id: 'first-prediction',
    name: 'Первый прогноз',
    icon: '🎯',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-700',
    unlocked: true,
    date: '15.01.2026',
  },
  {
    id: 'streak-5',
    name: 'Серия 5+',
    icon: '🔥',
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-red-600',
    unlocked: true,
    date: '22.02.2026',
  },
  {
    id: 'passer',
    name: 'Проходчик',
    icon: '📈',
    color: 'text-teal-400',
    gradient: 'from-teal-500 to-teal-700',
    unlocked: true,
    date: '05.03.2026',
  },
  {
    id: 'capper',
    name: 'Каппер',
    icon: '🏆',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-amber-600',
    unlocked: true,
    date: '10.03.2026',
  },
  {
    id: 'roi-master',
    name: 'ROI мастер',
    icon: '💎',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-violet-700',
    unlocked: true,
    date: '12.03.2026',
  },
  {
    id: 'early-bird',
    name: 'Ранний пташка',
    icon: '⏰',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-blue-700',
    unlocked: true,
    date: '18.03.2026',
  },
  {
    id: 'analyst',
    name: 'Аналитик',
    icon: '🔍',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-cyan-700',
    unlocked: true,
    date: '20.03.2026',
  },
  {
    id: 'express-hero',
    name: 'Экспресс-герой',
    icon: '⚡',
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-amber-700',
    unlocked: true,
    date: '25.03.2026',
  },
  {
    id: 'legend',
    name: 'Легенда',
    icon: '👑',
    color: 'text-gray-500',
    gradient: 'from-gray-600 to-gray-800',
    unlocked: false,
  },
  {
    id: 'millionaire',
    name: 'Миллионер',
    icon: '💰',
    color: 'text-gray-500',
    gradient: 'from-gray-600 to-gray-800',
    unlocked: false,
  },
];

export function AchievementBadges() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-5">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Достижения</h2>
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
          {achievements.filter(a => a.unlocked).length}/{achievements.length}
        </Badge>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 snap-carousel lg:overflow-visible">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 min-w-full lg:min-w-0">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`glass-card rounded-xl p-4 text-center relative group transition-all duration-300 ${
                achievement.unlocked
                  ? 'hover:shadow-lg hover:shadow-yellow-500/5 hover:border-yellow-500/30'
                  : 'opacity-60'
              }`}
            >
              {/* Icon circle */}
              <div className="mx-auto mb-3 relative">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${achievement.gradient} flex items-center justify-center text-2xl mx-auto shadow-lg ${
                    !achievement.unlocked ? 'grayscale' : ''
                  }`}
                >
                  {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                </div>
                {!achievement.unlocked && (
                  <div className="absolute -bottom-1 -right-1 left-1/2 -translate-x-1/2 translate-x-3">
                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className={`text-xs font-semibold mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                {achievement.name}
              </h3>

              {/* Date */}
              {achievement.unlocked ? (
                <p className="text-[10px] text-gray-500">
                  Получено {achievement.date}
                </p>
              ) : (
                <p className="text-[10px] text-gray-600">
                  Заблокировано
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
