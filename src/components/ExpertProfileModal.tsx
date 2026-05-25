'use client';

import { useMemo } from 'react';
import { Expert } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Users, Calendar, Target, Star, Heart, Check } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';

interface ExpertProfileModalProps {
  expert: Expert | null;
  open: boolean;
  onClose: () => void;
}

// Generate simulated monthly performance data for the expert
function generatePerformanceData(expert: Expert) {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
  const baseRate = expert.winRate;
  return months.map((month, _i) => {
    const variance = (Math.random() - 0.5) * 20;
    const rate = Math.max(40, Math.min(95, baseRate + variance));
    const predictions = Math.floor(30 + Math.random() * 40);
    const wins = Math.floor(predictions * rate / 100);
    return { month, winRate: Math.round(rate), predictions, wins, losses: predictions - wins };
  });
}

export function ExpertProfileModal({ expert, open, onClose }: ExpertProfileModalProps) {
  const { favoriteExperts, toggleFavoriteExpert, subscribedExperts, toggleSubscription } = useAppStore();

  const performanceData = useMemo(() => {
    if (!expert) return [];
    return generatePerformanceData(expert);
  }, [expert]);

  if (!expert) return null;

  const lastResults = expert.lastResults;
  const isFavorite = favoriteExperts.includes(expert.id);
  const isSubscribed = subscribedExperts.includes(expert.id);

  const handleSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSubscription(expert.id);
    if (!isSubscribed) {
      toast.success(`Вы подписались на ${expert.name}`, {
        description: 'Теперь вы будете получать его прогнозы',
      });
    } else {
      toast.info(`Подписка на ${expert.name} отменена`);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteExpert(expert.id);
    toast[isFavorite ? 'info' : 'success'](
      isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное',
      { description: expert.name }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#151b23] border-gray-700/50 text-gray-100 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-yellow-500/20">
              {expert.avatar}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">{expert.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                  <Trophy className="w-3 h-3 mr-1" />
                  Топ-эксперт
                </Badge>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                  {expert.specialty}
                </Badge>
                {isSubscribed && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Подписка
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Bio */}
        <p className="text-sm text-gray-400 leading-relaxed">
          {expert.bio || `Профессиональный каппер с многолетним опытом в сфере ${expert.specialty}. Специализируется на прогнозах высшей категории уверенности.`}
        </p>

        {/* Key Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700/30">
            <Target className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-400">{expert.winRate}%</p>
            <p className="text-[10px] text-gray-500 uppercase">Проход</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700/30">
            <TrendingUp className="w-4 h-4 text-teal-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-teal-400">+{expert.roi}%</p>
            <p className="text-[10px] text-gray-500 uppercase">ROI</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700/30">
            <Calendar className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{expert.totalPredictions}</p>
            <p className="text-[10px] text-gray-500 uppercase">Прогнозов</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700/30">
            <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-yellow-400">{expert.streak}</p>
            <p className="text-[10px] text-gray-500 uppercase">Серия</p>
          </div>
        </div>

        {/* Last results */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Последние результаты</h4>
          <div className="flex gap-1.5">
            {lastResults.map((result, i) => (
              <div
                key={i}
                className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-bold ${
                  result === 'W'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-600">Старые</span>
            <span className="text-[10px] text-gray-600">Новые</span>
          </div>
        </div>

        <Separator className="bg-gray-700/50" />

        {/* Performance chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Динамика проходимости</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} />
              <YAxis domain={[30, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="winRate"
                name="Проходимость %"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly volume */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Объём прогнозов по месяцам</h4>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={performanceData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="wins" name="Победы" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="losses" name="Поражения" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Win rate progress */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Общая проходимость</h4>
          <div className="flex items-center gap-3">
            <Progress value={expert.winRate} className="flex-1 h-3 bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500" />
            <span className="text-sm font-bold text-emerald-400 min-w-[40px] text-right">{expert.winRate}%</span>
          </div>
        </div>

        <Separator className="bg-gray-700/50" />

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            className={`flex-1 font-medium shadow-lg ${
              isSubscribed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
            }`}
            onClick={handleSubscribe}
          >
            <Users className="w-4 h-4 mr-2" />
            {isSubscribed ? 'Отписаться' : 'Подписаться'}
          </Button>
          <Button
            variant="outline"
            className={`flex-1 border-gray-700 hover:bg-gray-800 hover:text-white ${
              isFavorite ? 'text-red-400 border-red-500/30 hover:bg-red-500/10' : 'text-gray-300'
            }`}
            onClick={handleFavorite}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'В избранном' : 'В избранное'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
