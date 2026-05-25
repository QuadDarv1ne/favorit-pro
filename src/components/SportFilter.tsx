'use client';

import { sportCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SportFilterProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export function SportFilter({ activeFilter, onFilterChange }: SportFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Button
        variant={activeFilter === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange(null)}
        className={`shrink-0 text-xs h-8 ${
          activeFilter === null
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
            : 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        Все
      </Button>
      {sportCategories.map((sport) => (
        <Button
          key={sport.id}
          variant={activeFilter === sport.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(activeFilter === sport.id ? null : sport.id)}
          className={`shrink-0 text-xs h-8 ${
            activeFilter === sport.id
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
              : 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <span className="mr-1">{sport.icon}</span>
          {sport.name}
        </Button>
      ))}
      {activeFilter && (
        <button
          onClick={() => onFilterChange(null)}
          className="shrink-0 p-1 rounded-full bg-gray-800 text-gray-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
