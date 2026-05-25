'use client';

import { useMemo } from 'react';
import { Match } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radio, TrendingUp, BarChart3, History, Flame, Heart, Bell, Activity, UserCircle } from 'lucide-react';
import { MatchTimeline } from '@/components/MatchTimeline';
import { Progress } from '@/components/ui/progress';
import { useAppStore, FavoriteMatch } from '@/stores/app-store';
import { toast } from 'sonner';

interface MatchDetailModalProps {
  match: Match | null;
  open: boolean;
  onClose: () => void;
}

export function MatchDetailModal({ match, open, onClose }: MatchDetailModalProps) {
  const { addBet, betSlip, setBetSlipOpen, favoriteMatches, toggleFavoriteMatch } = useAppStore();

  if (!match) return null;

  const sportEmoji = match.sport === 'football' ? '⚽' : match.sport === 'hockey' ? '🏒' : match.sport === 'basketball' ? '🏀' : match.sport === 'tennis' ? '🎾' : '🎮';
  const isFavorite = favoriteMatches.find((f) => f.id === match.id);

  const handleOddsClick = (type: '1' | 'X' | '2', odds: number) => {
    const prediction = type === '1' ? `П1: ${match.homeTeam}` : type === 'X' ? 'Ничья' : `П2: ${match.awayTeam}`;
    const betId = `${match.id}-${type}`;
    addBet({
      id: betId,
      matchTitle: `${match.homeTeam} — ${match.awayTeam}`,
      prediction,
      odds,
      sport: match.sport,
      league: match.league,
    });
    const isInSlip = betSlip.find((b) => b.id === betId);
    if (!isInSlip) {
      toast.success('Добавлено в купон', {
        description: `${match.homeTeam} — ${match.awayTeam}: ${prediction} @ ${odds.toFixed(2)}`,
        action: { label: 'Открыть', onClick: () => setBetSlipOpen(true) },
      });
    }
  };

  const handleFavorite = () => {
    const favMatch: FavoriteMatch = {
      id: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      sport: match.sport,
      startTime: match.startTime,
    };
    toggleFavoriteMatch(favMatch);
    toast[isFavorite ? 'info' : 'success'](
      isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное',
      { description: `${match.homeTeam} — ${match.awayTeam}` }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#151b23] border-gray-700/50 text-gray-100 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
              {sportEmoji} {match.league}
            </Badge>
            {match.status === 'live' && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </Badge>
            )}
            {match.isHot && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs flex items-center gap-1">
                <Flame className="w-3 h-3" />
                HOT
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            {match.homeTeam} vs {match.awayTeam}
          </DialogTitle>
        </DialogHeader>

        {/* Score */}
        {match.status !== 'upcoming' && (
          <div className="flex items-center justify-center gap-6 py-4 bg-gray-800/50 rounded-xl">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">{match.homeTeam}</p>
              <p className="text-3xl font-bold text-white">{match.homeScore ?? '-'}</p>
            </div>
            <div className="text-xs text-gray-500">VS</div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">{match.awayTeam}</p>
              <p className="text-3xl font-bold text-white">{match.awayScore ?? '-'}</p>
            </div>
          </div>
        )}

        {/* Odds - clickable */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleOddsClick('1', match.homeOdds)}
            className="bg-gray-800/50 hover:bg-emerald-500/20 rounded-xl p-3 text-center transition-colors"
          >
            <span className="text-xs text-gray-400 block mb-1">1</span>
            <span className="text-lg font-bold text-emerald-400">{match.homeOdds.toFixed(2)}</span>
          </button>
          {match.drawOdds && (
            <button
              onClick={() => { const draw = match.drawOdds; if (draw != null) handleOddsClick('X', draw); }}
              className="bg-gray-800/50 hover:bg-gray-600/50 rounded-xl p-3 text-center transition-colors"
            >
              <span className="text-xs text-gray-400 block mb-1">X</span>
              <span className="text-lg font-bold text-gray-300">{match.drawOdds.toFixed(2)}</span>
            </button>
          )}
          <button
            onClick={() => handleOddsClick('2', match.awayOdds)}
            className="bg-gray-800/50 hover:bg-emerald-500/20 rounded-xl p-3 text-center transition-colors"
          >
            <span className="text-xs text-gray-400 block mb-1">2</span>
            <span className="text-lg font-bold text-emerald-400">{match.awayOdds.toFixed(2)}</span>
          </button>
        </div>

        <Tabs defaultValue="analysis" className="mt-2">
          <TabsList className="bg-gray-800/50 border-gray-700/50 w-full">
            <TabsTrigger value="analysis" className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Анализ
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="h2h" className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <History className="w-3.5 h-3.5 mr-1" />
              H2H
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <Activity className="w-3.5 h-3.5 mr-1" />
              События
            </TabsTrigger>
            <TabsTrigger value="lineups" className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <UserCircle className="w-3.5 h-3.5 mr-1" />
              Составы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="mt-3">
            {match.prediction ? (
              <div className="space-y-3">
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-semibold text-emerald-400">Прогноз: {match.prediction}</span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                      {match.confidence}% уверенности
                    </Badge>
                  </div>
                  <Progress value={match.confidence} className="h-2 bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500" />
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  На основе анализа последних 10 матчей обеих команд, текущей формы, травм и дисквалификаций,
                  наш эксперт рекомендует ставку <span className="text-emerald-400 font-medium">{match.prediction}</span> с коэффициентом{' '}
                  <span className="text-white font-medium">{match.homeOdds.toFixed(2)}</span>.
                  Уровень уверенности составляет {match.confidence}%.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Прогноз пока не добавлен</p>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Форма (последние 5)</span>
                <div className="flex gap-1">
                  {['W', 'W', 'L', 'W', 'W'].map((r, i) => (
                    <span key={i} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${r === 'W' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <Separator className="bg-gray-700/50" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{match.homeTeam} — победы дома</span>
                <span className="text-emerald-400 font-medium">72%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{match.awayTeam} — победы на выезде</span>
                <span className="text-yellow-400 font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Среднее голов за матч</span>
                <span className="text-white font-medium">2.8</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Тотал больше 2.5</span>
                <span className="text-emerald-400 font-medium">64%</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="h2h" className="mt-3">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-8 bg-gray-800/50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">5</p>
                  <p className="text-xs text-gray-400">{match.homeTeam}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg text-gray-500">Ничьи: 2</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">3</p>
                  <p className="text-xs text-gray-400">{match.awayTeam}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">Последние 10 личных встреч</p>
              {[
                { date: '15.03.2026', home: 2, away: 1 },
                { date: '28.11.2025', home: 1, away: 1 },
                { date: '05.09.2025', home: 0, away: 2 },
              ].map((game, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-gray-400 bg-gray-800/30 rounded-lg px-3 py-2">
                  <span>{game.date}</span>
                  <span className="font-medium text-white">{game.home} : {game.away}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-3">
            <MatchTimeline matchId={match.id} />
          </TabsContent>

          <TabsContent value="lineups" className="mt-3">
            <LineupsTab homeTeam={match.homeTeam} awayTeam={match.awayTeam} sport={match.sport} />
          </TabsContent>
        </Tabs>

        <Separator className="bg-gray-700/50 my-2" />

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium">
            <Bell className="w-4 h-4 mr-1.5" />
            Следить
          </Button>
          <Button
            variant="outline"
            className={`flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 ${isFavorite ? 'text-red-400 border-red-500/30' : ''}`}
            onClick={handleFavorite}
          >
            <Heart className={`w-4 h-4 mr-1.5 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'В избранном' : 'В избранное'}
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Radio className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Deterministic pseudo-random rating based on input string hash
function getSeededRating(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 6 + (Math.abs(hash) % 30) / 10;
}

function generateLineup(teamName: string, _isHome: boolean, sport: string) {
  const isRacketSport = sport === 'tennis';
  if (isRacketSport) {
    return {
      formation: null,
      players: [
        { number: 0, name: teamName, position: 'Игрок', rating: getSeededRating(teamName).toFixed(1) },
      ],
    };
  }

  const surnames = ['Иванов', 'Петров', 'Сидоров', 'Козлов', 'Новиков', 'Морозов', 'Волков', 'Соколов', 'Лебедев', 'Кузнецов', 'Попов'];
  const positions = sport === 'football'
    ? ['ВР', 'ЗЩ', 'ЗЩ', 'ЗЩ', 'ЗЩ', 'ПЗ', 'ПЗ', 'ПЗ', 'НП', 'НП', 'НП']
    : sport === 'hockey'
    ? ['ВР', 'ЗЩ', 'ЗЩ', 'НП', 'НП', 'НП', 'ЗЩ', 'ЗЩ', 'НП', 'НП', 'НП', 'НП', 'НП', 'НП', 'НП', 'НП', 'НП', 'НП']
    : ['Разыгр.', 'Защ.', 'Защ.', 'Форвард', 'Форвард'];

  const formation = sport === 'football' ? '4-3-3' : sport === 'hockey' ? '3-2-1' : null;

  return {
    formation,
    players: positions.map((pos, i) => ({
      number: i + 1,
      name: surnames[i % surnames.length],
      position: pos,
      rating: getSeededRating(surnames[i % surnames.length] + pos).toFixed(1),
    })),
  };
}

// Lineups tab component with simulated team lineups
function LineupsTab({ homeTeam, awayTeam, sport }: { homeTeam: string; awayTeam: string; sport: string }) {
  const isRacketSport = sport === 'tennis';

  const homeLineup = useMemo(() => generateLineup(homeTeam, true, sport), [homeTeam, sport]);
  const awayLineup = useMemo(() => generateLineup(awayTeam, false, sport), [awayTeam, sport]);

  if (isRacketSport) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-6 bg-gray-800/50 rounded-xl p-4">
          {[homeLineup, awayLineup].map((lineup, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg font-bold text-white mb-2">
                {lineup.players[0].name[0]}
              </div>
              <p className="text-sm font-semibold text-white">{lineup.players[0].name}</p>
              <p className="text-xs text-gray-500 mt-1">Рейтинг: <span className="text-emerald-400">{lineup.players[0].rating}</span></p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center">Индивидуальный спорт — составы не применяются</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Home team */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">{homeTeam}</h4>
          {homeLineup.formation && (
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-[10px]">
              {homeLineup.formation}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          {homeLineup.players.slice(0, 11).map((player, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${
                i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-gray-800/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  i === 0 ? 'bg-yellow-500/30 text-yellow-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {player.number}
                </span>
                <span className="text-gray-300 font-medium">{player.name}</span>
                <span className="text-gray-600">{player.position}</span>
              </div>
              <span className={`font-medium ${
                parseFloat(player.rating) >= 8 ? 'text-emerald-400' :
                parseFloat(player.rating) >= 7 ? 'text-teal-400' : 'text-gray-500'
              }`}>
                {player.rating}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-700/50" />

      {/* Away team */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">{awayTeam}</h4>
          {awayLineup.formation && (
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-[10px]">
              {awayLineup.formation}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          {awayLineup.players.slice(0, 11).map((player, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${
                i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-gray-800/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  i === 0 ? 'bg-yellow-500/30 text-yellow-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {player.number}
                </span>
                <span className="text-gray-300 font-medium">{player.name}</span>
                <span className="text-gray-600">{player.position}</span>
              </div>
              <span className={`font-medium ${
                parseFloat(player.rating) >= 8 ? 'text-emerald-400' :
                parseFloat(player.rating) >= 7 ? 'text-teal-400' : 'text-gray-500'
              }`}>
                {player.rating}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-gray-600 text-center mt-2">Составы предварительные и могут измениться</p>
    </div>
  );
}
