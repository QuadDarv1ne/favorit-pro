'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react';

export function BetCalculator() {
  const [odds, setOdds] = useState('1.85');
  const [stake, setStake] = useState('1000');
  const [systemSize, setSystemSize] = useState('2');

  // Express calculator
  const [expressLegs, setExpressLegs] = useState([
    { odds: '1.75', label: 'Реал — Ман Сити: Обе забьют' },
    { odds: '1.55', label: 'Бавария — Дортмунд: П1' },
    { odds: '1.90', label: 'Ак Барс — СКА: ТБ 4.5' },
  ]);

  const singleOdds = parseFloat(odds) || 0;
  const singleStake = parseFloat(stake) || 0;
  const singleWin = singleOdds > 0 ? (singleStake * singleOdds).toFixed(2) : '0';
  const singleProfit = singleOdds > 0 ? (singleStake * singleOdds - singleStake).toFixed(2) : '0';

  const expressTotalOdds = expressLegs.reduce((acc, leg) => acc * (parseFloat(leg.odds) || 1), 1);
  const expressWin = (singleStake * expressTotalOdds).toFixed(2);
  const expressProfit = (singleStake * expressTotalOdds - singleStake).toFixed(2);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">Калькулятор ставок</h2>
      </div>

      <Tabs defaultValue="single" className="max-w-2xl mx-auto">
        <TabsList className="bg-gray-800/50 border-gray-700/50 w-full mb-4">
          <TabsTrigger value="single" className="flex-1 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Одиночная
          </TabsTrigger>
          <TabsTrigger value="express" className="flex-1 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Экспресс
          </TabsTrigger>
          <TabsTrigger value="system" className="flex-1 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Система
          </TabsTrigger>
        </TabsList>

        {/* Single bet */}
        <TabsContent value="single">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Коэффициент</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="1.01"
                    value={odds}
                    onChange={(e) => setOdds(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white text-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Сумма ставки (₽)</label>
                  <Input
                    type="number"
                    min="10"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white text-lg font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400 mb-1">Выплата</p>
                  <p className="text-lg font-bold text-emerald-400">{singleWin} ₽</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <TrendingUp className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400 mb-1">Чистая прибыль</p>
                  <p className="text-lg font-bold text-teal-400">+{singleProfit} ₽</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <Percent className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400 mb-1">ROI</p>
                  <p className="text-lg font-bold text-purple-400">
                    {singleStake > 0 ? ((parseFloat(singleProfit) / singleStake) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>

              {/* Quick stake buttons */}
              <div className="flex gap-2 mt-4">
                {[100, 500, 1000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setStake(String(amount))}
                    className="flex-1 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 text-xs"
                  >
                    {amount} ₽
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Express */}
        <TabsContent value="express">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-6">
              <div className="space-y-3 mb-6">
                {expressLegs.map((leg, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-900/50 rounded-lg px-3 py-2.5">
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 text-xs shrink-0">
                      {leg.odds}
                    </Badge>
                    <span className="text-sm text-gray-300 flex-1 truncate">{leg.label}</span>
                    <button
                      onClick={() => setExpressLegs(expressLegs.filter((_, idx) => idx !== i))}
                      className="text-gray-500 hover:text-red-400 text-xs transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpressLegs([...expressLegs, { odds: '1.50', label: 'Новое событие' }])}
                  className="w-full border-dashed border-gray-700 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50"
                >
                  + Добавить событие
                </Button>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-400 mb-1.5 block">Сумма ставки (₽)</label>
                <Input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white text-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">Общий коэфф.</p>
                  <p className="text-lg font-bold text-emerald-400">{expressTotalOdds.toFixed(2)}</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">Выплата</p>
                  <p className="text-lg font-bold text-emerald-400">{expressWin} ₽</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">Прибыль</p>
                  <p className="text-lg font-bold text-teal-400">+{expressProfit} ₽</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Размер системы</label>
                  <Input
                    type="number"
                    min="2"
                    max="10"
                    value={systemSize}
                    onChange={(e) => setSystemSize(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Кол-во событий</label>
                  <Input
                    type="number"
                    min="3"
                    max="15"
                    value={String(expressLegs.length)}
                    readOnly
                    className="bg-gray-900 border-gray-700 text-gray-400"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-400 mb-1.5 block">Сумма ставки (₽)</label>
                <Input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white text-lg font-semibold"
                />
              </div>

              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                <p className="text-sm text-gray-300 mb-1">
                  Система <span className="text-emerald-400 font-medium">{systemSize} из {expressLegs.length}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Количество комбинаций: <span className="text-white font-medium">
                    {combinations(expressLegs.length, parseInt(systemSize))}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Макс. выигрыш при всех проходах:{' '}
                  <span className="text-emerald-400 font-medium">
                    {(singleStake * expressTotalOdds).toFixed(2)} ₽
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function combinations(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}
