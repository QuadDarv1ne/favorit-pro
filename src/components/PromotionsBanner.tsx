'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Star, ArrowRight, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const promotions = [
  {
    id: 1,
    title: '5 фрибетов по 1000 рублей',
    description: 'Всем новым клиентам! Зарегистрируйтесь и получите 5 фрибетов для начала ставок.',
    icon: <Gift className="w-8 h-8 text-emerald-400" />,
    gradient: 'from-emerald-600/20 to-teal-600/20',
    border: 'border-emerald-500/30',
    cta: 'Получить бонус',
    action: 'Зарегистрируйтесь для получения фрибетов',
  },
  {
    id: 2,
    title: 'PARI PASS — Программа лояльности',
    description: 'Выполняй задания и забирай фрибеты! Копи баллы и обменивай на призы.',
    icon: <Star className="w-8 h-8 text-yellow-400" />,
    gradient: 'from-yellow-600/20 to-amber-600/20',
    border: 'border-yellow-500/30',
    cta: 'Участвовать',
    action: 'Раздел программы лояльности скоро откроется',
  },
  {
    id: 3,
    title: 'Экспресс дня — повышенный коэфф.',
    description: 'Каждый день сборная экспресс-ставка с увеличенным коэффициентом от наших аналитиков.',
    icon: <Zap className="w-8 h-8 text-purple-400" />,
    gradient: 'from-purple-600/20 to-violet-600/20',
    border: 'border-purple-500/30',
    cta: 'Смотреть',
    action: 'Экспресс дня обновляется каждое утро в 10:00 МСК',
  },
];

export function PromotionsBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Акции и бонусы</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promotions.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-br ${promo.gradient} ${promo.border} hover:scale-[1.02] transition-all duration-300`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  {promo.icon}
                  <h3 className="text-sm font-bold text-white leading-tight">{promo.title}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">{promo.description}</p>
                <Button
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm w-full"
                  onClick={() => toast.info(promo.title, { description: promo.action })}
                >
                  {promo.cta}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
