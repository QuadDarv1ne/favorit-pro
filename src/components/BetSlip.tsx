'use client';

import { useAppStore, BetSlipItem } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingCart, X, Trash2, Check, Zap,
  TrendingUp
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

export const BetSlip = React.memo(function BetSlip({ onPlaceBet }: { onPlaceBet?: (bets: BetSlipItem[], stake: number, type: 'single' | 'express' | 'system') => void }) {
  const { betSlip, removeBet, clearBetSlip, betSlipOpen, setBetSlipOpen } = useAppStore();
  const [stake, setStake] = useState('1000');
  const [activeTab, setActiveTab] = useState('single');

  const totalOdds = useMemo(() => betSlip.reduce((acc, item) => acc * item.odds, 1), [betSlip]);
  const stakeNum = parseFloat(stake) || 0;
  const potentialWin = stakeNum * totalOdds;
  const potentialProfit = potentialWin - stakeNum;
  const canMakeMulti = betSlip.length >= 2;

  // Reset to single bet mode when selections drop below 2
  React.useEffect(() => {
    if (!canMakeMulti && (activeTab === 'express' || activeTab === 'system')) {
      setActiveTab('single');
    }
  }, [canMakeMulti, activeTab]);

  return (
    <Sheet open={betSlipOpen} onOpenChange={setBetSlipOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {betSlip.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {betSlip.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="bg-[#0d1117] border-gray-800 text-gray-100 w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-white">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              Купон ставок
              {betSlip.length > 0 && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  {betSlip.length}
                </Badge>
              )}
            </SheetTitle>
            {betSlip.length > 0 && (
              <button
                onClick={clearBetSlip}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Очистить
              </button>
            )}
          </div>
        </SheetHeader>

        {betSlip.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-1">Купон пуст</p>
            <p className="text-xs text-gray-600">Нажмите на коэффициент, чтобы добавить ставку</p>
          </div>
        ) : (
          <>
            {/* Bet type tabs */}
            <div className="px-4 pt-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-800/50 border-gray-700/50 w-full">
                  <TabsTrigger value="single" className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                    Одиночная
                  </TabsTrigger>
                  {canMakeMulti && (
                    <>
                      <TabsTrigger value="express" className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                        Экспресс
                      </TabsTrigger>
                      <TabsTrigger value="system" className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                        Система
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>
              </Tabs>
            </div>

            {/* Bet items */}
            <ScrollArea className="flex-1 px-4 py-3">
              <div className="space-y-2">
                {betSlip.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">{item.league}</p>
                        <p className="text-sm font-medium text-white truncate">{item.matchTitle}</p>
                      </div>
                      <button
                        onClick={() => removeBet(item.id)}
                        className="text-gray-500 hover:text-red-400 shrink-0 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {item.prediction}
                      </Badge>
                      <span className="text-sm font-bold text-emerald-400">{item.odds.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Bet summary */}
            <div className="border-t border-gray-800 p-4 space-y-3">
              {/* Stake input */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Сумма ставки (₽)</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white font-semibold"
                  />
                  <div className="flex gap-1">
                    {[100, 500, 1000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setStake(String(amount))}
                        className="border-gray-700 text-gray-400 hover:text-white text-[10px] px-2 h-8"
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {activeTab === 'single' && betSlip.length > 1
                  ? betSlip.map((item) => {
                      const singleWin = stakeNum * item.odds;
                      const singleProfit = singleWin - stakeNum;
                      return (
                        <div key={item.id} className="bg-gray-800/50 rounded-lg p-2 text-center">
                          <p className="text-[10px] text-gray-500 truncate">{item.prediction}</p>
                          <p className="text-sm font-bold text-emerald-400">{item.odds.toFixed(2)}</p>
                          <p className="text-[10px] text-white">+{singleProfit.toFixed(0)} ₽</p>
                        </div>
                      );
                    })
                  : (
                    <>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-500">Коэфф.</p>
                        <p className="text-sm font-bold text-emerald-400">
                          {activeTab === 'single' ? betSlip[0]?.odds.toFixed(2) : totalOdds.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-500">Выплата</p>
                        <p className="text-sm font-bold text-white">{potentialWin.toFixed(0)} ₽</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <p className="text-[10px] text-gray-500">Прибыль</p>
                        <p className="text-sm font-bold text-emerald-400">+{potentialProfit.toFixed(0)} ₽</p>
                      </div>
                    </>
                  )}
              </div>

              {activeTab === 'express' && betSlip.length > 1 && (
                <div className="bg-emerald-500/10 rounded-lg p-2 flex items-center gap-2 border border-emerald-500/20">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-300">Экспресс коэфф. {totalOdds.toFixed(2)}</span>
                </div>
              )}

              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20 h-11"
                onClick={() => {
                  if (stakeNum <= 0) {
                    toast.error('Введите сумму ставки');
                    return;
                  }
                  if (!useAppStore.getState().isLoggedIn) {
                    toast.error('Войдите в аккаунт, чтобы сделать ставку');
                    return;
                  }
                  onPlaceBet?.(betSlip, stakeNum, activeTab as 'single' | 'express' | 'system');
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Сделать ставку ({betSlip.length})
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
});
