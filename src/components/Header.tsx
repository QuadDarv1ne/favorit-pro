'use client';

import { ActiveSection } from '@/types/navigation';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { NotificationBell } from '@/components/NotificationBell';
import { BetSlip } from '@/components/BetSlip';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAppStore } from '@/stores/app-store';
import { useState } from 'react';
import Image from 'next/image';
import {
  Menu, X, TrendingUp, Trophy, BarChart3, Newspaper, CheckCircle, Calculator, Search, User, Heart, Crown, FileText
} from 'lucide-react';

const navItems: { id: ActiveSection; label: string; icon: React.ReactNode }[] = [
  { id: 'main', label: 'Главная', icon: <Trophy className="w-4 h-4" /> },
  { id: 'sports', label: 'Спорт', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'experts', label: 'Эксперты', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 'leaderboard', label: 'Лидерборд', icon: <Crown className="w-4 h-4" /> },
  { id: 'articles', label: 'Статьи', icon: <FileText className="w-4 h-4" /> },
  { id: 'stats', label: 'Статистика', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'calculator', label: 'Калькулятор', icon: <Calculator className="w-4 h-4" /> },
  { id: 'news', label: 'Медиа', icon: <Newspaper className="w-4 h-4" /> },
  { id: 'results', label: 'Результаты', icon: <CheckCircle className="w-4 h-4" /> },
];

interface HeaderProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  onAuthClick: (tab: 'login' | 'register') => void;
}

export function Header({ activeSection, onSectionChange, onAuthClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isLoggedIn, user } = useAppStore();

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={() => onSectionChange('main')}
            className="flex items-center gap-2 shrink-0"
          >
            <Image src="/logo.png" alt="ФП" width={32} height={32} className="rounded-lg" />
            <span className="text-base font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent hidden sm:inline">
              ФаворитПро
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <button
              aria-label={searchOpen ? 'Закрыть поиск' : 'Открыть поиск'}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-4 h-4" />
            </button>

            <ThemeToggle />
            <NotificationBell />
            <BetSlip />

            {/* Favorites button */}
            <button
              aria-label="Избранное"
              onClick={() => onSectionChange('favorites')}
              className={`p-2 rounded-lg transition-colors ${
                activeSection === 'favorites'
                  ? 'text-red-400 bg-red-500/10'
                  : 'text-gray-400 hover:text-red-400 hover:bg-gray-800/50'
              }`}
              title="Избранное"
            >
              <Heart className={`w-5 h-5 ${activeSection === 'favorites' ? 'fill-current' : ''}`} />
            </button>

            {isLoggedIn ? (
              <button
                aria-label={isLoggedIn ? 'Мой профиль' : 'Войти'}
                onClick={() => onSectionChange('profile')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === 'profile'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {user?.avatar || 'U'}
                </div>
                <span className="hidden sm:inline text-xs">{user?.name?.split(' ')[0] || 'Профиль'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Войти в аккаунт"
                  onClick={() => onAuthClick('login')}
                  className="hidden sm:flex border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 h-8 text-xs"
                >
                  Войти
                </Button>
                <Button
                  size="sm"
                  aria-label="Зарегистрироваться"
                  onClick={() => onAuthClick('register')}
                  className="hidden sm:flex bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium h-8 text-xs"
                >
                  Регистрация
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <SearchBar />
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-800 mt-2 pt-3">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              {/* Profile in mobile menu */}
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    onSectionChange('profile');
                  } else {
                    onAuthClick('login');
                  }
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === 'profile'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <User className="w-4 h-4" />
                {isLoggedIn ? 'Мой профиль' : 'Войти'}
              </button>

              {!isLoggedIn && (
                <div className="flex gap-2 mt-3 px-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { onAuthClick('login'); setMobileMenuOpen(false); }}
                    className="flex-1 border-emerald-500/50 text-emerald-400"
                  >
                    Войти
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => { onAuthClick('register'); setMobileMenuOpen(false); }}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                  >
                    Регистрация
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
