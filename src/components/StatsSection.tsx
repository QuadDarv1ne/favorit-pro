'use client';

import { statsData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Percent, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444'];

export function StatsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">Статистика и аналитика</h2>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-400">Всего прогнозов</span>
            </div>
            <p className="text-2xl font-bold text-white">{statsData.totalPredictions.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-400">Проходимость</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{statsData.winRate}%</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-gray-400">Средний коэфф.</span>
            </div>
            <p className="text-2xl font-bold text-white">{statsData.avgOdds}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-400">ROI</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">+{statsData.roi}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Результаты по месяцам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statsData.monthlyStats} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                <Bar dataKey="wins" name="Победы" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" name="Поражения" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Trend */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Прибыль по месяцам (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={statsData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} />
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
                  dataKey="profit"
                  name="Прибыль %"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sport Distribution */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Проходимость по видам спорта</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statsData.sportStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="predictions"
                  nameKey="sport"
                  label={({ sport, winRate }) => `${sport} ${winRate}%`}
                  labelLine={{ stroke: '#9ca3af' }}
                >
                  {statsData.sportStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sport Win Rates */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Детализация по видам спорта</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsData.sportStats.map((stat, index) => (
                <div key={stat.sport}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-300">{stat.sport}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">{stat.predictions} прогнозов</span>
                      <span className="text-emerald-400 font-medium">{stat.winRate}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stat.winRate}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
