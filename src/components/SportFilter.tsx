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
            : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
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
              : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
          <span className="mr-1">{sport.icon}</span>
          {sport.name}
        </Button>
      ))}
      {activeFilter && (
        <button
          onClick={() => onFilterChange(null)}
          className="shrink-0 p-1 rounded-full bg-muted text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
