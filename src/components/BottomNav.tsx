'use client';

import { ActiveSection } from '@/types/navigation';
import { Trophy, TrendingUp, CheckCircle, BarChart3, Calculator, ShoppingCart, User } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

const bottomNavItems: { id: ActiveSection; label: string; icon: React.ReactNode }[] = [
  { id: 'main', label: 'Главная', icon: <Trophy className="w-5 h-5" /> },
  { id: 'sports', label: 'Спорт', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'experts', label: 'Эксперты', icon: <CheckCircle className="w-5 h-5" /> },
  { id: 'calculator', label: 'Кальк.', icon: <Calculator className="w-5 h-5" /> },
  { id: 'stats', label: 'Стат.', icon: <BarChart3 className="w-5 h-5" /> },
];

interface BottomNavProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export function BottomNav({ activeSection, onSectionChange }: BottomNavProps) {
  const betSlipCount = useAppStore((s) => s.betSlip.length);
  const toggleBetSlip = useAppStore((s) => s.toggleBetSlip);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur-md border-t border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around h-14 px-1">
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
              activeSection === item.id
                ? 'text-emerald-400'
                : 'text-gray-500 active:text-gray-300'
            }`}
          >
            {item.icon}
            <span className="text-[9px] font-medium">{item.label}</span>
          </button>
        ))}

        {/* Bet slip or profile button */}
        <button
          onClick={() => {
            if (isLoggedIn) {
              onSectionChange('profile');
            } else {
              toggleBetSlip();
            }
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition-colors ${
            activeSection === 'profile'
              ? 'text-emerald-400'
              : 'text-gray-500 active:text-gray-300'
          }`}
        >
          <div className="relative">
            {isLoggedIn ? <User className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
            {!isLoggedIn && betSlipCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                {betSlipCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium">{isLoggedIn ? 'Профиль' : 'Купон'}</span>
        </button>
      </div>
    </nav>
  );
}
