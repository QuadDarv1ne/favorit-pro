'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Target, BarChart3, TrendingUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Target,
    title: 'Прогнозы от экспертов',
    description: 'Получайте профессиональные прогнозы на спортивные события от проверенных капперов с подтверждённой проходимостью',
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'rgba(16, 185, 129, 0.15)',
  },
  {
    icon: BarChart3,
    title: 'Аналитика и статистика',
    description: 'Изучайте статистику, сравнивайте команды и находите value-ставки с помощью наших инструментов',
    gradient: 'from-teal-500 to-cyan-600',
    bgGlow: 'rgba(20, 184, 166, 0.15)',
  },
  {
    icon: TrendingUp,
    title: 'Зарабатывайте вместе',
    description: 'Подписывайтесь на лучших экспертов, отслеживайте банкролл и увеличивайте прибыль осознанных ставок',
    gradient: 'from-yellow-500 to-amber-600',
    bgGlow: 'rgba(234, 179, 8, 0.15)',
  },
];

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleClose = () => {
    localStorage.setItem('favoritpro-onboarding-seen', 'true');
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="bg-[#0d1117] border-gray-700/50 text-white max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">Добро пожаловать в Favorit Pro</DialogTitle>
        <div className="relative">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${step.bgGlow}, transparent 70%)`,
            }}
          />

          <div className="relative p-8 pb-6">
            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon in gradient circle */}
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            </AnimatePresence>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mt-8 mb-6">
              {steps.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'bg-emerald-400 w-6' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => setCurrentStep(i)}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Пропустить
              </button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm px-6 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20"
              >
                {currentStep === steps.length - 1 ? 'Начать' : 'Далее'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
