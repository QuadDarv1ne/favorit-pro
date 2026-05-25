'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface AnimatedOddsProps {
  odds: number;
  direction?: 'up' | 'down' | null;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedOdds({ odds, direction = null, size = 'md' }: AnimatedOddsProps) {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-lg px-4 py-2',
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {direction && (
          <motion.div
            key={`${odds}-${direction}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            className={`absolute inset-0 rounded-lg ${
              direction === 'up' ? 'bg-emerald-500/30' : 'bg-red-500/30'
            }`}
          />
        )}
      </AnimatePresence>

      <div
        className={`relative rounded-lg bg-gray-700/50 text-center min-w-[52px] transition-all duration-150 hover:bg-emerald-500/20 ${sizeClasses[size]}`}
      >
        {direction && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`absolute -top-1 -right-1 ${
              direction === 'up' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {direction === 'up' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
          </motion.span>
        )}
        <span className={`font-semibold ${
          direction === 'up' ? 'text-emerald-400' : direction === 'down' ? 'text-red-400' : 'text-emerald-400'
        } transition-colors duration-300`}>
          {odds.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
