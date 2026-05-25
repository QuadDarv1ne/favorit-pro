'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectionWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  skeletonType?: 'match' | 'prediction' | 'generic';
  skeletonCount?: number;
  title?: string;
  className?: string;
}

function GenericSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-32 bg-gray-800/40 rounded-xl border border-gray-700/20" />
        </div>
      ))}
    </div>
  );
}

export function SectionWrapper({
  children,
  isLoading: _isLoading,
  isError,
  error,
  onRetry,
  skeletonType: _skeletonType,
  skeletonCount: _skeletonCount,
  title,
  className = '',
}: SectionWrapperProps) {
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">Ошибка загрузки</h3>
        <p className="text-sm text-gray-400 text-center max-w-sm mb-4">
          {error?.message || 'Не удалось загрузить данные. Проверьте подключение к интернету.'}
        </p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Повторить
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

export { GenericSkeleton };
