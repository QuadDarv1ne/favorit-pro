'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, TrendingUp, Trophy, Flame, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'win' | 'hot' | 'live' | 'prediction';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: '1', type: 'win', title: 'Прогноз зашёл!',
    description: 'Алексей Капперов: Зенит П1 — выигрыш @ 1.45', time: '2 мин назад', read: false,
  },
  {
    id: '2', type: 'hot', title: 'Горячий матч',
    description: 'Реал Мадрид — Ман Сити начинается через 2 часа', time: '15 мин назад', read: false,
  },
  {
    id: '3', type: 'prediction', title: 'Новый прогноз',
    description: 'КиберГуру опубликовал прогноз на Spirit vs Tundra', time: '30 мин назад', read: false,
  },
  {
    id: '4', type: 'live', title: 'Гол!',
    description: 'Спартак 1:1 ЦСКА — 67-я минута', time: '1 ч назад', read: true,
  },
  {
    id: '5', type: 'win', title: 'Экспресс зашёл!',
    description: 'Ваш экспресс (3 события) — коэфф. 4.85', time: '2 ч назад', read: true,
  },
];

const typeConfig = {
  win: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  hot: { icon: <Flame className="w-4 h-4" />, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  live: { icon: <TrendingUp className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/20' },
  prediction: { icon: <Trophy className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
};

const STORAGE_KEY = 'favoritpro-notifications';

function loadNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return initialNotifications;
}

function saveNotifications(notifs: Notification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
  } catch { /* ignore */ }
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        aria-label={`Уведомления${unreadCount > 0 ? `, ${unreadCount} непрочитанн${unreadCount === 1 ? 'ое' : unreadCount < 5 ? 'ых' : 'ых'}` : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-[#151b23] border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Уведомления</span>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5 py-0">
                    {unreadCount} новых
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] text-emerald-400 hover:text-emerald-300">
                  Прочитать все
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  Нет уведомлений
                </div>
              ) : (
                notifications.map((notif) => {
                  const config = typeConfig[notif.type];
                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 px-3 py-2.5 hover:bg-gray-800/30 transition-colors relative ${
                        !notif.read ? 'bg-gray-800/20' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center ${config.color} shrink-0 mt-0.5`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <p className={`text-xs font-medium ${!notif.read ? 'text-white' : 'text-gray-300'}`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">{notif.description}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-gray-600" />
                          <span className="text-[10px] text-gray-600">{notif.time}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {!notif.read && (
                        <span className="absolute top-3 right-6 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-700/50">
              <Button variant="ghost" size="sm" className="w-full text-xs text-gray-400 hover:text-white">
                Все уведомления
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
