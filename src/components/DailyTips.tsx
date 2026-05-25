'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tip {
  id: string;
  icon: string;
  text: string;
  category: string;
  accentColor: string;
  borderColor: string;
  bgColor: string;
}

const tips: Tip[] = [
  {
    id: '1',
    icon: '💡',
    text: 'Обращайте внимание на движение коэффициентов — падение коэффа часто означает инсайдерскую информацию',
    category: 'Лайв',
    accentColor: 'text-blue-400',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: '2',
    icon: '🧠',
    text: 'Не ставьте на матчи своей любимой команды — эмоции мешают анализу',
    category: 'Психология',
    accentColor: 'text-purple-400',
    borderColor: 'border-l-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: '3',
    icon: '💰',
    text: 'Финансовый менеджмент: не ставьте больше 5% банка на одно событие',
    category: 'Банкролл',
    accentColor: 'text-emerald-400',
    borderColor: 'border-l-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: '4',
    icon: '📊',
    text: 'Сравнивайте коэффициенты у разных букмекеров — разница в 0.1 даёт +10% к прибыли на дистанции',
    category: 'Стратегия',
    accentColor: 'text-teal-400',
    borderColor: 'border-l-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  {
    id: '5',
    icon: '🔍',
    text: 'Изучайте личные встречи команд — история часто повторяется',
    category: 'Аналитика',
    accentColor: 'text-orange-400',
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

export const DailyTips = React.memo(function DailyTips() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isManualScrollRef = useRef(false);

  const startAutoRotate = useCallback(() => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    autoRotateRef.current = setInterval(() => {
      if (!isManualScrollRef.current) {
        setActiveIndex((prev) => {
          const next = (prev + 1) % tips.length;
          if (scrollRef.current) {
            const cardWidth = scrollRef.current.children[0]?.clientWidth || 300;
            scrollRef.current.scrollTo({
              left: next * (cardWidth + 16),
              behavior: 'smooth',
            });
          }
          return next;
        });
      }
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoRotate();
    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [startAutoRotate]);

  const handleManualScroll = useCallback(() => {
    isManualScrollRef.current = true;
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);

    // Detect current card from scroll position
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 300;
      const newIndex = Math.round(scrollLeft / (cardWidth + 16));
      setActiveIndex(newIndex);
    }

    // Resume auto-rotation after 10 seconds of inactivity
    setTimeout(() => {
      isManualScrollRef.current = false;
      startAutoRotate();
    }, 10000);
  }, [startAutoRotate]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-5">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Советы дня</h2>
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
          {tips.length} советов
        </Badge>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleManualScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 snap-carousel"
      >
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`min-w-[280px] sm:min-w-[320px] snap-start glass-card rounded-xl p-5 border-l-4 ${tip.borderColor} group hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full ${tip.bgColor} flex items-center justify-center text-lg shrink-0`}>
                {tip.icon}
              </div>
              <Badge variant="secondary" className={`${tip.bgColor} ${tip.accentColor} text-[10px] shrink-0`}>
                {tip.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{tip.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-3">
        {tips.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-emerald-400' : 'w-1.5 bg-gray-700'
            }`}
          />
        ))}
      </div>
    </section>
  );
});
