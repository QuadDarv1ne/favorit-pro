'use client';

import { useRef } from 'react';
import { Prediction } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Share2, Clock, User, BarChart3, AlertCircle, Heart, ShoppingCart } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useSyncFavorites } from '@/hooks/use-api';
import { toast } from 'sonner';

interface PredictionDetailModalProps {
  prediction: Prediction | null;
  open: boolean;
  onClose: () => void;
}

export function PredictionDetailModal({ prediction, open, onClose }: PredictionDetailModalProps) {
  const { favoritePredictionIds, addBet, setBetSlipOpen } = useAppStore();
  const { togglePrediction } = useSyncFavorites();
  const storeRef = useRef(useAppStore.getState);

  if (!prediction || !open) return null;

  const sportEmoji = prediction.sport === 'football' ? '⚽' : prediction.sport === 'hockey' ? '🏒' : prediction.sport === 'basketball' ? '🏀' : prediction.sport === 'tennis' ? '🎾' : '🎮';
  const sportName = prediction.sport === 'football' ? 'Футбол' : prediction.sport === 'hockey' ? 'Хоккей' : prediction.sport === 'basketball' ? 'Баскетбол' : prediction.sport === 'tennis' ? 'Теннис' : 'Киберспорт';
  const isFavorite = favoritePredictionIds.includes(prediction.id);

  const handleFavorite = () => {
    togglePrediction(prediction.id);
    const isFav = !storeRef.current().favoritePredictionIds.includes(prediction.id);
    toast[isFav ? 'success' : 'info'](
      isFav ? 'Добавлено в избранное' : 'Удалено из избранного',
      { description: prediction.matchTitle }
    );
  };

  const handleAddToSlip = () => {
    const betId = `pred-${prediction.id}`;
    addBet({
      id: betId,
      matchTitle: prediction.matchTitle,
      prediction: prediction.prediction,
      odds: prediction.odds,
      sport: prediction.sport,
      league: sportName,
    });
    const isInSlip = storeRef.current().betSlip.find((b) => b.id === betId);
    if (!isInSlip) {
      toast.success('Добавлено в купон', {
        description: `${prediction.matchTitle}: ${prediction.prediction} @ ${prediction.odds.toFixed(2)}`,
        action: {
          label: 'Открыть',
          onClick: () => setBetSlipOpen(true),
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#151b23] border-gray-700/50 text-gray-100 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
              {sportEmoji} {sportName}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {prediction.createdAt}
            </div>
          </div>
          <DialogTitle className="text-lg font-bold text-white">
            {prediction.matchTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Main prediction */}
        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-xl font-bold text-emerald-400">{prediction.prediction}</span>
            </div>
            <span className="text-lg font-bold text-white">@ {prediction.odds.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Уверенность</span>
            <span className="text-sm font-bold text-emerald-400">{prediction.confidence}%</span>
          </div>
          <Progress value={prediction.confidence} className="h-2 bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500" />
        </div>

        {/* Analysis */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <h4 className="text-sm font-semibold text-gray-300">Детальный анализ</h4>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{prediction.analysis}</p>
          <p className="text-sm text-gray-400 leading-relaxed mt-2">
            Дополнительные факторы: текущая форма команд, травмы ключевых игроков, статистика личных встреч,
            мотивация команд в контексте турнира, а также погодные условия и фактор домашнего поля.
            На основании комплексного анализа рекомендуется данный прогноз с уровнем уверенности {prediction.confidence}%.
          </p>
        </div>

        <Separator className="bg-gray-700/50" />

        {/* Risk indicator */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <h4 className="text-sm font-semibold text-gray-300">Оценка риска</h4>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className={`rounded-lg p-2.5 text-center border ${
              prediction.confidence >= 75 ? 'bg-emerald-500/10 border-emerald-500/30' :
              prediction.confidence >= 60 ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-red-500/10 border-red-500/30'
            }`}>
              <span className="text-xs text-gray-400 block">Уровень</span>
              <span className={`text-sm font-bold ${
                prediction.confidence >= 75 ? 'text-emerald-400' :
                prediction.confidence >= 60 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {prediction.confidence >= 75 ? 'Низкий' : prediction.confidence >= 60 ? 'Средний' : 'Высокий'}
              </span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2.5 text-center border border-gray-700/30">
              <span className="text-xs text-gray-400 block">Коэфф.</span>
              <span className="text-sm font-bold text-white">{prediction.odds.toFixed(2)}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2.5 text-center border border-gray-700/30">
              <span className="text-xs text-gray-400 block">Прибыль</span>
              <span className="text-sm font-bold text-emerald-400">+{((prediction.odds - 1) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Expert info */}
        <div className="flex items-center gap-3 bg-gray-800/30 rounded-xl p-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-sm font-bold text-white">
            {prediction.expertName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-gray-500" />
              <span className="text-sm font-medium text-white">{prediction.expertName}</span>
            </div>
            <span className="text-xs text-gray-500">Автор прогноза</span>
          </div>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-400 hover:text-white text-xs h-7">
            Профиль
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/20"
            onClick={handleAddToSlip}
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            В купон @ {prediction.odds.toFixed(2)}
          </Button>
          <Button
            variant="outline"
            className={`border-gray-700 ${isFavorite ? 'text-red-400 border-red-500/30' : 'text-gray-400 hover:text-white'}`}
            onClick={handleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
