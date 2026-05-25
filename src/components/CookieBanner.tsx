'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-16 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md z-50 bg-[#151b23] border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 p-4"
        >
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-300 mb-3">
                Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с{' '}
                <a href="#" className="text-emerald-400 hover:text-emerald-300 underline">политикой обработки данных</a>.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={accept}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs"
                >
                  Принять
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={accept}
                  className="border-gray-700 text-gray-400 text-xs hover:text-white"
                >
                  Только необходимые
                </Button>
              </div>
            </div>
            <button onClick={accept} className="text-gray-500 hover:text-gray-300 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
