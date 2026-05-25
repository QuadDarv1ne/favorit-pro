'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ActiveSection } from '@/types/navigation';

interface KeyboardShortcutsProps {
  onSectionChange: (section: ActiveSection) => void;
  onAuthClick: (tab: 'login' | 'register') => void;
  onSearchOpen: () => void;
}

const shortcutMap: Record<string, { section: ActiveSection; label: string; icon: string }> = {
  '1': { section: 'main', label: 'Главная', icon: '🏠' },
  '2': { section: 'sports', label: 'Спорт', icon: '⚽' },
  '3': { section: 'experts', label: 'Эксперты', icon: '👥' },
  '4': { section: 'stats', label: 'Статистика', icon: '📊' },
  '5': { section: 'news', label: 'Медиа', icon: '📰' },
  '6': { section: 'results', label: 'Результаты', icon: '✅' },
  '7': { section: 'calculator', label: 'Калькулятор', icon: '🧮' },
  '8': { section: 'profile', label: 'Профиль', icon: '👤' },
};

export function useKeyboardShortcuts({ onSectionChange, onAuthClick, onSearchOpen }: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger when typing in inputs
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement ||
      (e.target as HTMLElement).isContentEditable
    ) {
      return;
    }

    // Alt + number = navigate to section
    if (e.altKey && shortcutMap[e.key]) {
      e.preventDefault();
      onSectionChange(shortcutMap[e.key].section);
      return;
    }

    // Alt + S = search
    if (e.altKey && (e.key === 's' || e.key === 'ы' || e.key === 'S' || e.key === 'Ы')) {
      e.preventDefault();
      onSearchOpen();
      return;
    }

    // Alt + L = login
    if (e.altKey && (e.key === 'l' || e.key === 'д' || e.key === 'L' || e.key === 'Д')) {
      e.preventDefault();
      onAuthClick('login');
      return;
    }

    // Alt + K = show shortcuts
    if (e.altKey && (e.key === 'k' || e.key === 'л' || e.key === 'K' || e.key === 'Л')) {
      e.preventDefault();
      // Toggle is handled by the component
      return;
    }

    // Escape = close
    if (e.key === 'Escape') {
      return;
    }
  }, [onSectionChange, onAuthClick, onSearchOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'k' || e.key === 'л')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div
        className="bg-[#151b23] border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/50 max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-700/50">
          <h3 className="text-lg font-bold text-white">Клавиатурные шорткаты</h3>
          <p className="text-xs text-gray-500 mt-0.5">Используйте Alt + клавиша для быстрой навигации</p>
        </div>

        <div className="px-5 py-3 space-y-1 max-h-80 overflow-y-auto">
          {Object.entries(shortcutMap).map(([key, { label, icon }]) => (
            <div key={key} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{icon}</span>
                <span className="text-sm text-gray-300">{label}</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700/50 text-[10px] text-gray-400 border border-gray-600/50 font-mono">Alt</kbd>
                <span className="text-gray-600 text-xs">+</span>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700/50 text-[10px] text-gray-400 border border-gray-600/50 font-mono">{key}</kbd>
              </div>
            </div>
          ))}

          <div className="border-t border-gray-700/30 my-2 pt-2">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-gray-300">🔍 Поиск</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700/50 text-[10px] text-gray-400 border border-gray-600/50 font-mono">Alt</kbd>
                <span className="text-gray-600 text-xs">+</span>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700/50 text-[10px] text-gray-400 border border-gray-600/50 font-mono">S</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-gray-300">🔑 Войти</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700/50 text-[10px] text-gray-400 border border-gray-600/50 font-mono">Alt</kbd>
                <span className="text-gray-600 text-xs">+</span>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700/50 text-[10px] text-gray-400 border border-gray-600/50 font-mono">L</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-gray-300">⌨️ Эта подсказка</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700/50 text-[10px] text-gray-400 border border-gray-600/50 font-mono">Alt</kbd>
                <span className="text-gray-600 text-xs">+</span>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-700/50 text-[10px] text-gray-400 border border-gray-600/50 font-mono">K</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-700/50 bg-gray-800/20">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-xs text-gray-400 hover:text-white transition-colors text-center"
          >
            Нажмите Esc или Alt+K чтобы закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
