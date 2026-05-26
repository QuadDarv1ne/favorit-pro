'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

const recentWins = [
  { id: 'rw1', user: 'Алексей К.', match: 'Ливерпуль — Тоттенхэм', prediction: 'П1', odds: 1.50, profit: '+750 ₽', time: '2 мин назад', sport: 'football' },
  { id: 'rw2', user: 'Мария Т.', match: 'Медведев — Циципас', prediction: 'П1', odds: 1.90, profit: '+950 ₽', time: '5 мин назад', sport: 'tennis' },
  { id: 'rw3', user: 'Дмитрий Ш.', match: 'Ак Барс — СКА', prediction: 'ТБ 4.5', odds: 1.90, profit: '+1 900 ₽', time: '12 мин назад', sport: 'hockey' },
  { id: 'rw4', user: 'Сергей А.', match: 'ЦСКА М — Химки', prediction: 'Ф1(-8.5)', odds: 1.85, profit: '+1 850 ₽', time: '18 мин назад', sport: 'basketball' },
  { id: 'rw5', user: 'Игорь С.', match: 'Зенит — Локомотив', prediction: 'П1', odds: 1.45, profit: '+435 ₽', time: '25 мин назад', sport: 'football' },
  { id: 'rw6', user: 'КиберГуру', match: 'NAVI — FaZe', prediction: 'П1 2-0', odds: 2.10, profit: '+2 100 ₽', time: '30 мин назад', sport: 'cybersport' },
  { id: 'rw7', user: 'Павел В.', match: 'Арсенал — Челси', prediction: 'Ф1(-1)', odds: 2.25, profit: '+2 250 ₽', time: '45 мин назад', sport: 'football' },
  { id: 'rw8', user: 'Ольга М.', match: 'Бавария — Дортмунд', prediction: 'П1', odds: 1.55, profit: '+775 ₽', time: '1 ч назад', sport: 'football' },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    'from-emerald-400 to-teal-600',
    'from-purple-400 to-violet-600',
    'from-orange-400 to-red-600',
    'from-cyan-400 to-blue-600',
    'from-pink-400 to-rose-600',
    'from-yellow-400 to-amber-600',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

const sportEmojis: Record<string, string> = {
  football: '⚽',
  hockey: '🏒',
  basketball: '🏀',
  tennis: '🎾',
  cybersport: '🎮',
};

export function RecentWinsFeed() {
  // Double the items for seamless loop
  const items = [...recentWins, ...recentWins];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-bold text-white">Недавние победы</h2>
        <span className="text-xs text-gray-500 ml-2">8 побед за последний час</span>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gray-800/30 backdrop-blur-md border border-emerald-500/20 py-4">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0d1117] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0d1117] to-transparent z-10 pointer-events-none" />

        <div className="flex wins-ticker">
          {items.map((win, index) => (
            <div
              key={`${win.id}-${index}`}
              className="flex items-center gap-3 px-4 shrink-0"
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(win.user)} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                {getInitials(win.user)}
              </div>

              {/* Content */}
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-xs font-medium text-white">{win.user}</span>
                <span className="text-[10px] text-gray-500">{sportEmojis[win.sport] || '🏅'}</span>
                <span className="text-xs text-gray-400">{win.match}</span>
                <span className="text-xs text-emerald-400 font-medium">{win.prediction}</span>
                <span className="text-[10px] text-gray-500">@ {win.odds.toFixed(2)}</span>
                <span className="text-xs text-emerald-400 font-bold">{win.profit}</span>
                <span className="text-[10px] text-gray-600">{win.time}</span>
                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .wins-ticker {
          animation: ticker-scroll 40s linear infinite;
        }
        .wins-ticker:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .wins-ticker {
            animation: none;
            transform: translateX(0);
          }
        }
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
