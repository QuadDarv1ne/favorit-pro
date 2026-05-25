'use client';

import React, { useState } from 'react';
import { upcomingMatches, liveMatches } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { GitCompareArrows, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamStats {
  winRate: number;
  lastResults: ('W' | 'L')[];
  avgGoals: number;
  leaguePosition: number;
  form: 'up' | 'down' | 'stable';
  totalTeams: number;
}

const mockTeamStats: Record<string, TeamStats> = {
  'Спартак': { winRate: 58, lastResults: ['W', 'L', 'W', 'W', 'L'], avgGoals: 1.8, leaguePosition: 4, form: 'up', totalTeams: 16 },
  'ЦСКА': { winRate: 62, lastResults: ['W', 'W', 'L', 'W', 'W'], avgGoals: 1.5, leaguePosition: 2, form: 'up', totalTeams: 16 },
  'Арсенал': { winRate: 71, lastResults: ['W', 'W', 'W', 'L', 'W'], avgGoals: 2.1, leaguePosition: 1, form: 'up', totalTeams: 20 },
  'Челси': { winRate: 45, lastResults: ['L', 'W', 'L', 'W', 'L'], avgGoals: 1.2, leaguePosition: 10, form: 'down', totalTeams: 20 },
  'Ак Барс': { winRate: 64, lastResults: ['W', 'W', 'L', 'W', 'W'], avgGoals: 3.2, leaguePosition: 3, form: 'up', totalTeams: 24 },
  'СКА': { winRate: 60, lastResults: ['W', 'L', 'W', 'L', 'W'], avgGoals: 2.8, leaguePosition: 5, form: 'stable', totalTeams: 24 },
  'ЦСКА М': { winRate: 78, lastResults: ['W', 'W', 'W', 'W', 'L'], avgGoals: 85.4, leaguePosition: 1, form: 'up', totalTeams: 12 },
  'Химки': { winRate: 35, lastResults: ['L', 'L', 'W', 'L', 'L'], avgGoals: 72.1, leaguePosition: 9, form: 'down', totalTeams: 12 },
  'Медведев': { winRate: 67, lastResults: ['W', 'L', 'W', 'W', 'L'], avgGoals: 0, leaguePosition: 8, form: 'stable', totalTeams: 64 },
  'Циципас': { winRate: 62, lastResults: ['L', 'W', 'W', 'L', 'W'], avgGoals: 0, leaguePosition: 12, form: 'stable', totalTeams: 64 },
  'Team Spirit': { winRate: 70, lastResults: ['W', 'W', 'L', 'W', 'W'], avgGoals: 0, leaguePosition: 2, form: 'up', totalTeams: 16 },
  'Tundra': { winRate: 55, lastResults: ['W', 'L', 'L', 'W', 'W'], avgGoals: 0, leaguePosition: 6, form: 'stable', totalTeams: 16 },
  'Реал Мадрид': { winRate: 74, lastResults: ['W', 'W', 'W', 'L', 'W'], avgGoals: 2.3, leaguePosition: 1, form: 'up', totalTeams: 20 },
  'Ман Сити': { winRate: 68, lastResults: ['W', 'L', 'W', 'W', 'W'], avgGoals: 2.0, leaguePosition: 3, form: 'up', totalTeams: 20 },
  'Интер': { winRate: 66, lastResults: ['W', 'W', 'L', 'W', 'L'], avgGoals: 1.9, leaguePosition: 2, form: 'stable', totalTeams: 20 },
  'Ювентус': { winRate: 52, lastResults: ['L', 'W', 'W', 'L', 'W'], avgGoals: 1.4, leaguePosition: 5, form: 'down', totalTeams: 20 },
  'Тампа Бэй': { winRate: 59, lastResults: ['W', 'L', 'W', 'W', 'L'], avgGoals: 3.4, leaguePosition: 4, form: 'stable', totalTeams: 32 },
  'Флорида': { winRate: 63, lastResults: ['W', 'W', 'W', 'L', 'W'], avgGoals: 3.1, leaguePosition: 2, form: 'up', totalTeams: 32 },
  'Бавария': { winRate: 76, lastResults: ['W', 'W', 'W', 'W', 'W'], avgGoals: 2.5, leaguePosition: 1, form: 'up', totalTeams: 18 },
  'Дортмунд': { winRate: 54, lastResults: ['W', 'L', 'L', 'W', 'W'], avgGoals: 1.7, leaguePosition: 4, form: 'stable', totalTeams: 18 },
  'Лейкерс': { winRate: 50, lastResults: ['L', 'W', 'W', 'L', 'W'], avgGoals: 108.3, leaguePosition: 7, form: 'stable', totalTeams: 30 },
  'Селтикс': { winRate: 72, lastResults: ['W', 'W', 'W', 'L', 'W'], avgGoals: 112.5, leaguePosition: 1, form: 'up', totalTeams: 30 },
  'G2 Esports': { winRate: 68, lastResults: ['W', 'W', 'L', 'W', 'W'], avgGoals: 0, leaguePosition: 1, form: 'up', totalTeams: 10 },
  'Fnatic': { winRate: 52, lastResults: ['L', 'W', 'L', 'W', 'W'], avgGoals: 0, leaguePosition: 4, form: 'stable', totalTeams: 10 },
};

const allMatches = [...liveMatches, ...upcomingMatches];
const teamNames = Array.from(new Set(allMatches.flatMap((m) => [m.homeTeam, m.awayTeam])));

function getTeamNames(matchId: string): [string, string] {
  const match = allMatches.find((m) => m.id === matchId);
  return match ? [match.homeTeam, match.awayTeam] : ['', ''];
}

function ComparisonBar({ leftVal, rightVal, leftColor, rightColor }: { leftVal: number; rightVal: number; leftColor: string; rightColor: string }) {
  const total = leftVal + rightVal;
  const leftPct = total > 0 ? (leftVal / total) * 100 : 50;
  const rightPct = total > 0 ? (rightVal / total) * 100 : 50;

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 flex justify-end">
        <div className={`h-2 rounded-l-full ${leftColor}`} style={{ width: `${leftPct}%` }} />
      </div>
      <div className="flex-1">
        <div className={`h-2 rounded-r-full ${rightColor}`} style={{ width: `${rightPct}%` }} />
      </div>
    </div>
  );
}

function FormIcon({ form }: { form: 'up' | 'down' | 'stable' }) {
  if (form === 'up') return <TrendingUp className="w-4 h-4 text-emerald-400" />;
  if (form === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-yellow-400" />;
}

export const MatchComparison = React.memo(function MatchComparison() {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(allMatches[0]?.id || '');
  const [teamA, teamB] = getTeamNames(selectedMatchId);
  const statsA = mockTeamStats[teamA];
  const statsB = mockTeamStats[teamB];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-5">
        <GitCompareArrows className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">Сравнение команд</h2>
      </div>

      <div className="glass-card rounded-xl p-4 sm:p-6">
        {/* Match selector */}
        <div className="mb-6">
          <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Выберите матч</label>
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
          >
            {allMatches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.homeTeam} — {m.awayTeam} ({m.league})
              </option>
            ))}
          </select>
        </div>

        {statsA && statsB ? (
          <motion.div
            key={selectedMatchId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Team headers */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center mb-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold text-white mx-auto mb-2">
                  {teamA.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="text-sm font-semibold text-white truncate">{teamA}</h3>
                <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-[10px] mt-1">
                  #{statsA.leaguePosition} из {statsA.totalTeams}
                </Badge>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-orange-500/20">
                  VS
                </div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-sm font-bold text-white mx-auto mb-2">
                  {teamB.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="text-sm font-semibold text-white truncate">{teamB}</h3>
                <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-[10px] mt-1">
                  #{statsB.leaguePosition} из {statsB.totalTeams}
                </Badge>
              </div>
            </div>

            {/* Comparison rows */}
            <div className="space-y-4">
              {/* Win Rate */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center">
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400">{statsA.winRate}%</span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">Проход</span>
                <div className="text-left">
                  <span className="text-sm font-bold text-emerald-400">{statsB.winRate}%</span>
                </div>
              </div>
              <ComparisonBar leftVal={statsA.winRate} rightVal={statsB.winRate} leftColor="bg-emerald-500/60" rightColor="bg-red-500/60" />

              {/* Avg Goals */}
              {(statsA.avgGoals > 0 || statsB.avgGoals > 0) && (
                <>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center mt-4">
                    <div className="text-right">
                      <span className="text-sm font-bold text-teal-400">{statsA.avgGoals.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">Ср. гол/очк</span>
                    <div className="text-left">
                      <span className="text-sm font-bold text-teal-400">{statsB.avgGoals.toFixed(1)}</span>
                    </div>
                  </div>
                  <ComparisonBar leftVal={statsA.avgGoals} rightVal={statsB.avgGoals} leftColor="bg-teal-500/60" rightColor="bg-rose-500/60" />
                </>
              )}

              {/* League Position */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center mt-4">
                <div className="text-right">
                  <span className="text-sm font-bold text-yellow-400">#{statsA.leaguePosition}</span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">Позиция</span>
                <div className="text-left">
                  <span className="text-sm font-bold text-yellow-400">#{statsB.leaguePosition}</span>
                </div>
              </div>
              <ComparisonBar
                leftVal={Math.max(1, statsA.totalTeams - statsA.leaguePosition + 1)}
                rightVal={Math.max(1, statsB.totalTeams - statsB.leaguePosition + 1)}
                leftColor="bg-yellow-500/60"
                rightColor="bg-amber-500/60"
              />

              {/* Last 5 Results */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center mt-4">
                <div className="flex justify-end gap-1">
                  {statsA.lastResults.map((r, i) => (
                    <span
                      key={i}
                      className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                        r === 'W' ? 'bg-emerald-500/25 text-emerald-400' : 'bg-red-500/25 text-red-400'
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">Форма</span>
                <div className="flex justify-start gap-1">
                  {statsB.lastResults.map((r, i) => (
                    <span
                      key={i}
                      className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                        r === 'W' ? 'bg-emerald-500/25 text-emerald-400' : 'bg-red-500/25 text-red-400'
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Form Indicator */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center mt-4">
                <div className="flex justify-end items-center gap-1.5">
                  <span className="text-xs text-gray-400">
                    {statsA.form === 'up' ? 'Рост' : statsA.form === 'down' ? 'Спад' : 'Стабильно'}
                  </span>
                  <FormIcon form={statsA.form} />
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">Тренд</span>
                <div className="flex justify-start items-center gap-1.5">
                  <FormIcon form={statsB.form} />
                  <span className="text-xs text-gray-400">
                    {statsB.form === 'up' ? 'Рост' : statsB.form === 'down' ? 'Спад' : 'Стабильно'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            Выберите матч для сравнения команд
          </div>
        )}
      </div>
    </section>
  );
});
