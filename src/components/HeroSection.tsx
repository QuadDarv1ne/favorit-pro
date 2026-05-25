'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

function useCountUp(end: number, duration: number = 2000, startOnMount: boolean = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(startOnMount);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, started]);

  return count;
}

export function HeroSection() {
  const countPredictions = useCountUp(3583);
  const countWinRate = useCountUp(685);
  const countRoi = useCountUp(173);
  const countExperts = useCountUp(42);

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-[#0d1117] to-teal-900/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Floating particle effect behind stats */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 pointer-events-none">
        <div
          className="w-full h-full rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, rgba(20, 184, 166, 0.08) 40%, transparent 70%)',
            animation: 'float-particle 8s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="ФаворитПро" className="w-14 h-14 rounded-xl shadow-lg shadow-emerald-500/20" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <Flame className="w-4 h-4" />
                <span>Горячие прогнозы сегодня</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              Точные прогнозы
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                на спорт
              </span>
            </h1>

            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Профессиональная аналитика, экспертные прогнозы и статистика для осознанных ставок.
              Проходимость 68.5% за последний месяц.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
              >
                Смотреть прогнозы
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Стать экспертом
              </Button>
            </div>
          </motion.div>

          {/* Right stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-400">Прогнозов</span>
              </div>
              <p className="text-2xl font-bold text-white">{countPredictions.toLocaleString('ru-RU')}</p>
              <p className="text-xs text-emerald-400 mt-1">+245 за месяц</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-gray-400">Проходимость</span>
              </div>
              <p className="text-2xl font-bold text-white">{(countWinRate / 10).toFixed(1)}%</p>
              <p className="text-xs text-emerald-400 mt-1">+3.2% к пред. месяцу</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-gray-400">ROI</span>
              </div>
              <p className="text-2xl font-bold text-white">+{(countRoi / 10).toFixed(1)}%</p>
              <p className="text-xs text-emerald-400 mt-1">Средний коэфф. 1.82</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">Экспертов</span>
              </div>
              <p className="text-2xl font-bold text-white">{countExperts}</p>
              <p className="text-xs text-emerald-400 mt-1">6 в топ-рейтинге</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
