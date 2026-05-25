'use client';

import { useState, useEffect } from 'react';
import { liveMatches } from '@/lib/data';
import { Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tickerItems = [
  { sport: '⚽', text: 'Спартак 1:1 ЦСКА', league: 'РПЛ', minute: '67\'' },
  { sport: '⚽', text: 'Арсенал 2:0 Челси', league: 'АПЛ', minute: '52\'' },
  { sport: '🏒', text: 'Ак Барс 3:2 СКА', league: 'КХЛ', minute: '3 период' },
  { sport: '🏀', text: 'ЦСКА М 45:38 Химки', league: 'ВТБ', minute: 'Q2' },
  { sport: '🎮', text: 'Spirit vs Tundra — Карта 2', league: 'DreamLeague', minute: '' },
  { sport: '🎾', text: 'Медведев — Циципас — Сет 1', league: 'Roland Garros', minute: '' },
  { sport: '⚽', text: 'Реал М — Ман Сити — Завтра 22:00', league: 'ЛЧ', minute: '' },
  { sport: '⚽', text: 'Бавария — Дортмунд — Завтра 19:30', league: 'Бундеслига', minute: '' },
];

export function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
        setIsVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const item = tickerItems[currentIndex];

  return (
    <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-emerald-900/40 border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0">
          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Live</span>
        </div>

        <div className="relative h-5 overflow-hidden flex-1 max-w-md">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key={currentIndex}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center gap-2 text-sm"
              >
                <span className="text-xs">{item.sport}</span>
                <span className="text-white font-medium text-xs">{item.text}</span>
                {item.minute && (
                  <span className="text-emerald-400 text-xs">{item.minute}</span>
                )}
                <span className="text-gray-500 text-xs">• {item.league}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {tickerItems.map((_, i) => (
            <span
              key={i}
              className={`w-1 h-1 rounded-full transition-colors ${
                i === currentIndex ? 'bg-emerald-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
