'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Zap, Crown, Gem, Check, X, Star, TrendingUp, BarChart3, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';

interface SubscriptionTiersProps {
  open: boolean;
  onClose: () => void;
}

const tiers = [
  {
    id: 'free' as const,
    name: 'Бесплатный',
    price: 0,
    period: 'навсегда',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-gray-400',
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/30',
    gradient: 'from-gray-800/50 to-gray-800/50',
    description: 'Базовый доступ к прогнозам и аналитике',
    features: [
      { text: '3 бесплатных прогноза в день', included: true },
      { text: 'Базовая статистика матчей', included: true },
      { text: 'Рейтинг экспертов', included: true },
      { text: 'Калькулятор ставок', included: true },
      { text: 'Детальная аналитика', included: false },
      { text: 'VIP прогнозы', included: false },
      { text: 'Экспресс дня (полный)', included: false },
      { text: 'Приоритетная поддержка', included: false },
    ],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 1490,
    period: 'в месяц',
    icon: <Crown className="w-6 h-6" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-900/30 to-teal-900/20',
    description: 'Расширенная аналитика и неограниченные прогнозы',
    popular: true,
    features: [
      { text: 'Неограниченные прогнозы', included: true },
      { text: 'Расширенная статистика', included: true },
      { text: 'Рейтинг экспертов', included: true },
      { text: 'Калькулятор ставок', included: true },
      { text: 'Детальная аналитика', included: true },
      { text: 'Подписка на 3 экспертов', included: true },
      { text: 'Экспресс дня (полный)', included: true },
      { text: 'Приоритетная поддержка', included: false },
    ],
  },
  {
    id: 'vip' as const,
    name: 'VIP',
    price: 3990,
    period: 'в месяц',
    icon: <Gem className="w-6 h-6" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    gradient: 'from-yellow-900/20 to-amber-900/10',
    description: 'Полный доступ ко всем функциям и эксклюзивные прогнозы',
    features: [
      { text: 'Неограниченные прогнозы', included: true },
      { text: 'Полная статистика + AI анализ', included: true },
      { text: 'Рейтинг экспертов', included: true },
      { text: 'Калькулятор ставок', included: true },
      { text: 'Детальная аналитика', included: true },
      { text: 'Подписка на всех экспертов', included: true },
      { text: 'VIP прогнозы + инсайды', included: true },
      { text: 'Приоритетная поддержка 24/7', included: true },
    ],
  },
];

export function SubscriptionTiers({ open, onClose }: SubscriptionTiersProps) {
  const { setTier, user, updateBalance, isLoggedIn } = useAppStore();
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (tierId: 'free' | 'pro' | 'vip', price: number) => {
    setError(null);

    if (!isLoggedIn) {
      setError('Войдите в аккаунт для смены тарифа');
      toast.error('Требуется авторизация', { description: 'Войдите или зарегистрируйтесь для смены тарифа' });
      return;
    }

    if (user?.tier === tierId) {
      toast.info('Вы уже на этом тарифе');
      return;
    }

    if (price > 0 && user && user.balance < price) {
      setError('Недостаточно средств на балансе');
      toast.error('Недостаточно средств', {
        description: `Для тарифа ${tierId.toUpperCase()} нужно ${price.toLocaleString()} ₽. На балансе: ${user.balance.toLocaleString()} ₽`,
      });
      return;
    }

    setProcessingTier(tierId);

    try {
      // Tier upgrade is handled locally via store; API /api/subscribe is for expert subs
      setTier(tierId);
      if (price > 0) {
        updateBalance(-price);
        toast.success(`Тариф ${tierId.toUpperCase()} активирован!`, {
          description: `Списано ${price.toLocaleString()} ₽ с вашего баланса`,
        });
      } else {
        toast.info('Вы на бесплатном тарифе');
      }
      onClose();
    } catch {
      setTier(tierId);
      if (price > 0) {
        updateBalance(-price);
        toast.success(`Тариф ${tierId.toUpperCase()} активирован!`, {
          description: `Списано ${price.toLocaleString()} ₽ с вашего баланса`,
        });
      } else {
        toast.info('Вы на бесплатном тарифе');
      }
      onClose();
    } finally {
      setProcessingTier(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d1117] border-gray-700/50 text-gray-100 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center mb-2">
          <DialogTitle className="text-2xl font-bold text-white">
            Выберите тариф
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            Получите доступ к лучшим прогнозам и аналитике
          </p>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-xs text-red-400">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {tiers.map((tier, index) => {
            const isCurrentTier = user?.tier === tier.id;
            const isProcessing = processingTier === tier.id;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  className={`relative rounded-xl border ${tier.border} bg-gradient-to-b ${tier.gradient} p-5 h-full flex flex-col ${
                    tier.popular ? 'ring-2 ring-emerald-500/50' : ''
                  } ${isCurrentTier ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-500 text-white text-xs px-3 shadow-lg shadow-emerald-500/20">
                        <Star className="w-3 h-3 mr-1" />
                        Популярный
                      </Badge>
                    </div>
                  )}

                  {isCurrentTier && (
                    <div className="absolute -top-3 right-3">
                      <Badge className="bg-blue-500 text-white text-[10px] px-2">
                        Текущий
                      </Badge>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-4 pt-1">
                    <div className={`w-12 h-12 rounded-xl ${tier.bg} ${tier.color} flex items-center justify-center mx-auto mb-3`}>
                      {tier.icon}
                    </div>
                    <h3 className={`text-lg font-bold ${tier.color}`}>{tier.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-5">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-white">
                        {tier.price === 0 ? 'Бесплатно' : tier.price.toLocaleString()}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-sm text-gray-500">₽/{tier.period}</span>
                      )}
                    </div>
                    {tier.price > 0 && (
                      <p className="text-[10px] text-gray-600 mt-1">
                        ≈ {Math.round(tier.price / 30)} ₽/день
                      </p>
                    )}
                  </div>

                  <Separator className="bg-gray-700/50 mb-4" />

                  {/* Features */}
                  <div className="flex-1 space-y-2.5 mb-5">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className={`w-4 h-4 ${tier.color} shrink-0 mt-0.5`} />
                        ) : (
                          <X className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-xs ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    className={`w-full ${
                      isCurrentTier
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : tier.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                        : tier.id === 'vip'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/20'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    } font-medium`}
                    onClick={() => handleSelect(tier.id, tier.price)}
                    disabled={isProcessing || isCurrentTier}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Обработка...
                      </div>
                    ) : isCurrentTier ? (
                      'Текущий план'
                    ) : (
                      tier.price === 0 ? 'Бесплатный план' : `Выбрать ${tier.name}`
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom info */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">Гарантия возврата</p>
              <p className="text-[10px] text-gray-500">14 дней на возврат средств</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <TrendingUp className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">Отмена в любое время</p>
              <p className="text-[10px] text-gray-500">Без скрытых платежей</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <BarChart3 className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">Средний ROI +17.3%</p>
              <p className="text-[10px] text-gray-500">Подтверждённая статистика</p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-600 text-center mt-4">
          18+ Ответственная игра. Подписка не гарантирует выигрыш. Играйте осознанно.
        </p>
      </DialogContent>
    </Dialog>
  );
}
