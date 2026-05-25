'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const balanceHistory = [
  { day: '1 мар', balance: 5000 },
  { day: '5 мар', balance: 4200 },
  { day: '8 мар', balance: 5800 },
  { day: '12 мар', balance: 6100 },
  { day: '15 мар', balance: 5400 },
  { day: '18 мар', balance: 7200 },
  { day: '22 мар', balance: 8100 },
  { day: '25 мар', balance: 7600 },
  { day: '28 мар', balance: 9500 },
  { day: '1 апр', balance: 10200 },
  { day: '5 апр', balance: 9800 },
  { day: '10 апр', balance: 11500 },
  { day: '15 апр', balance: 12400 },
];

const maxBalance = Math.max(...balanceHistory.map(d => d.balance));
const minBalance = Math.min(...balanceHistory.map(d => d.balance));
const startBalance = balanceHistory[0].balance;
const endBalance = balanceHistory[balanceHistory.length - 1].balance;
const growthPercent = (((endBalance - startBalance) / startBalance) * 100).toFixed(1);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-bold text-emerald-400">{payload[0].value.toLocaleString('ru-RU')} ₽</p>
      </div>
    );
  }
  return null;
}

export function BankrollTracker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-gray-800/40 backdrop-blur-md border-gray-700/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            Динамика банкролла
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ArrowUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-gray-500">Макс. баланс</span>
              </div>
              <p className="text-sm font-bold text-emerald-400 tabular-nums">{maxBalance.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ArrowDown className="w-3 h-3 text-red-400" />
                <span className="text-[10px] text-gray-500">Мин. баланс</span>
              </div>
              <p className="text-sm font-bold text-red-400 tabular-nums">{minBalance.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-gray-500">Прирост</span>
              </div>
              <p className="text-sm font-bold text-emerald-400">+{growthPercent}%</p>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.2)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(75, 85, 99, 0.3)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(75, 85, 99, 0.3)' }}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k ₽`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#balanceGradient)"
                  dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: '#10b981', r: 5, stroke: '#0d1117', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
