'use client';

import { useState, lazy, Suspense } from 'react';
import { useAppStore, FavoritePrediction } from '@/stores/app-store';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  User, Wallet, Trophy, TrendingUp, Star, Bell, Settings,
  Crown, Gem, Zap, LogOut, Plus, ChevronRight, Heart,
  Calendar, Target, BarChart3, Users, Check, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { experts } from '@/lib/data';
import { toast } from 'sonner';
import { AchievementBadges } from '@/components/AchievementBadges';
import { BankrollTracker } from '@/components/BankrollTracker';
import { DEMO_USER } from '@/lib/demo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const LazyPredictionDetailModal = lazy(() =>
  import('@/components/PredictionDetailModal').then((mod) => ({ default: mod.PredictionDetailModal }))
);

const tierConfig = {
  free: { label: 'Бесплатный', color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30', icon: <Zap className="w-4 h-4" /> },
  pro: { label: 'Pro', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: <Crown className="w-4 h-4" /> },
  vip: { label: 'VIP', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: <Gem className="w-4 h-4" /> },
};

const recentActivity = [
  { id: '1', type: 'win', text: 'Прогноз зашёл: Зенит П1 @ 1.45', amount: '+450 ₽', time: '2 ч назад' },
  { id: '2', type: 'loss', text: 'Прогноз не зашёл: Ак Барс ТБ 4.5', amount: '-1000 ₽', time: '5 ч назад' },
  { id: '3', type: 'deposit', text: 'Пополнение баланса', amount: '+5000 ₽', time: '1 д назад' },
  { id: '4', type: 'win', text: 'Экспресс зашёл (3 события) @ 4.85', amount: '+3850 ₽', time: '2 д назад' },
  { id: '5', type: 'subscription', text: 'Подписка на Алексей Капперов', amount: '-1500 ₽', time: '3 д назад' },
];

const defaultNotifications = [
  { id: 'expert_predictions', label: 'Прогнозы экспертов', desc: 'Новые прогнозы от подписанных экспертов', enabled: true },
  { id: 'bet_results', label: 'Результаты ставок', desc: 'Уведомления о результатах прогнозов', enabled: true },
  { id: 'hot_matches', label: 'Горячие матчи', desc: 'Уведомления о начале важных матчей', enabled: false },
  { id: 'odds_changes', label: 'Изменения коэффициентов', desc: 'Существенные изменения в линиях', enabled: false },
  { id: 'promotions', label: 'Акции и бонусы', desc: 'Специальные предложения и промокоды', enabled: true },
];

export function UserCabinet() {
  const { user, favoriteExperts, favoriteMatches, favoritePredictions, subscribedExperts, setSubscriptionModalOpen, updateUser } = useAppStore();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<'name' | 'email' | 'password' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState<FavoritePrediction | null>(null);
  const [predictionModalOpen, setPredictionModalOpen] = useState(false);

  const currentUser = user ?? DEMO_USER;

  const tier = tierConfig[currentUser.tier];
  const winRate = currentUser.totalBets > 0 ? Math.round((currentUser.wonBets / currentUser.totalBets) * 100) : 0;

  const handleDeposit = () => {
    toast.success('Пополнение баланса', { description: 'Функция будет доступна в полной версии' });
  };

  const handleLogoutRequest = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    await signOut();
    toast.info('Вы вышли из аккаунта');
  };

  const handleToggleNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n));
      const target = updated.find((n) => n.id === id);
      if (target) {
        toast.success(target.enabled ? `${target.label} включены` : `${target.label} отключены`);
      }
      return updated;
    });
  };

  const handleEditProfile = (field: 'name' | 'email' | 'password') => {
    setEditingField(field);
    setEditValue(field === 'password' ? '' : currentUser[field]);
  };

  const handleSaveProfile = async () => {
    if (!editValue.trim()) {
      toast.error('Поле не может быть пустым');
      return;
    }
    if (editingField === 'password') {
      if (editValue.length < 8) {
        toast.error('Пароль должен быть не менее 8 символов');
        return;
      }
      // TODO: Implement password change API endpoint
      toast.info('Смена пароля будет доступна в ближайшее время');
      setEditingField(null);
      setEditValue('');
      return;
    }

    try {
      const body: Record<string, string> = {};
      if (editingField === 'email') {
        if (!editValue.includes('@')) {
          toast.error('Некорректный email');
          return;
        }
        body.email = editValue.trim();
      } else {
        body.name = editValue.trim();
      }

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Sync Zustand store with server response
      if (data.user) {
        updateUser(data.user);
      }

      toast.success(editingField === 'email' ? 'Email обновлён' : 'Имя обновлено');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось обновить профиль';
      toast.error('Ошибка обновления профиля', { description: message });
      return;
    }

    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-gray-800/80 via-gray-800/50 to-emerald-900/20 border-gray-700/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <CardContent className="p-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-emerald-500/20 shrink-0">
                {currentUser.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                  <Badge className={`${tier.bg} ${tier.color} ${tier.border} border text-xs`}>
                    {tier.icon}
                    <span className="ml-1">{tier.label}</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-3">{currentUser.email}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-gray-400">С {currentUser.joinedAt}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-gray-400">{subscribedExperts.length} подписок</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-gray-400">{favoriteExperts.length + favoriteMatches.length + favoritePredictions.length} избранного</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0 w-full sm:w-auto">
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Баланс</p>
                  <p className="text-2xl font-bold text-white">{currentUser.balance.toLocaleString()} ₽</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    onClick={handleDeposit}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Пополнить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubscriptionModalOpen(true)}
                    className="flex-1 sm:flex-none border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 text-xs"
                  >
                    <Gem className="w-3.5 h-3.5 mr-1" />
                    Улучшить
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Target className="w-5 h-5 text-emerald-400" />, label: 'Ставок', value: currentUser.totalBets, sub: `${currentUser.wonBets} выигрыш` },
          { icon: <TrendingUp className="w-5 h-5 text-teal-400" />, label: 'Проходимость', value: `${winRate}%`, sub: 'Персональная' },
          { icon: <Wallet className="w-5 h-5 text-purple-400" />, label: 'Прибыль', value: `+${currentUser.totalProfit.toLocaleString()} ₽`, sub: 'За всё время' },
          { icon: <Trophy className="w-5 h-5 text-yellow-400" />, label: 'Серия', value: '3 W', sub: 'Текущая' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AchievementBadges />

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="bg-gray-800/50 border-gray-700/50">
          <TabsTrigger value="activity" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <BarChart3 className="w-3.5 h-3.5 mr-1" />
            Активность
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Heart className="w-3.5 h-3.5 mr-1" />
            Избранное
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Users className="w-3.5 h-3.5 mr-1" />
            Подписки
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Settings className="w-3.5 h-3.5 mr-1" />
            Настройки
          </TabsTrigger>
        </TabsList>

        {/* Activity tab */}
        <TabsContent value="activity">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white">Последние действия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        activity.type === 'win' ? 'bg-emerald-500/20 text-emerald-400' :
                        activity.type === 'loss' ? 'bg-red-500/20 text-red-400' :
                        activity.type === 'deposit' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {activity.type === 'win' ? '✓' : activity.type === 'loss' ? '✗' : activity.type === 'deposit' ? '+' : '★'}
                      </div>
                      <div>
                        <p className="text-sm text-white">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${
                      activity.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {activity.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white">Статистика ставок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{currentUser.wonBets}</p>
                  <p className="text-xs text-gray-500">Победы</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{currentUser.totalBets - currentUser.wonBets}</p>
                  <p className="text-xs text-gray-500">Поражения</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{currentUser.totalBets}</p>
                  <p className="text-xs text-gray-500">Всего</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={winRate} className="flex-1 h-3 bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500" />
                <span className="text-sm font-bold text-emerald-400 min-w-[40px] text-right">{winRate}%</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <BankrollTracker />
          </div>
        </TabsContent>

        {/* Favorites tab */}
        <TabsContent value="favorites">
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Избранные эксперты ({favoriteExperts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteExperts.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-400 mb-1">Нет избранных экспертов</p>
                    <p className="text-xs text-gray-600">Нажмите звёздочку на эксперте, чтобы добавить</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {experts.filter(e => favoriteExperts.includes(e.id)).map(expert => (
                      <div key={expert.id} className="flex items-center gap-3 bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xs font-bold text-white">
                          {expert.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{expert.name}</p>
                          <p className="text-xs text-gray-500">{expert.specialty} • {expert.winRate}% проходимость</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-400">+{expert.roi}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  Избранные матчи ({favoriteMatches.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-400 mb-1">Нет избранных матчей</p>
                    <p className="text-xs text-gray-600">Добавляйте матчи в избранное для отслеживания</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {favoriteMatches.map(match => (
                      <div key={match.id} className="flex items-center gap-3 bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30">
                        <span className="text-lg">
                          {match.sport === 'football' ? '⚽' : match.sport === 'hockey' ? '🏒' : match.sport === 'basketball' ? '🏀' : match.sport === 'tennis' ? '🎾' : '🎮'}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{match.homeTeam} — {match.awayTeam}</p>
                          <p className="text-xs text-gray-500">{match.league} • {match.startTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Сохранённые прогнозы ({favoritePredictions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritePredictions.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-400 mb-1">Нет сохранённых прогнозов</p>
                    <p className="text-xs text-gray-600">Сохраняйте прогнозы, чтобы не потерять</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {favoritePredictions.map(pred => (
                      <div
                        key={pred.id}
                        className="flex items-center gap-3 bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30 cursor-pointer hover:bg-gray-900/70 transition-colors"
                        onClick={() => { setSelectedPrediction(pred); setPredictionModalOpen(true); }}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{pred.matchTitle}</p>
                          <p className="text-xs text-gray-500">{pred.expertName}: {pred.prediction}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-400">@ {pred.odds.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscriptions tab */}
        <TabsContent value="subscriptions">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Мои подписки ({subscribedExperts.length})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubscriptionModalOpen(true)}
                  className="border-emerald-500/50 text-emerald-400 text-xs hover:bg-emerald-500/10"
                >
                  Улучшить тариф
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {subscribedExperts.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 mb-1">Нет подписок на экспертов</p>
                  <p className="text-xs text-gray-600">Подпишитесь на экспертов, чтобы получать их прогнозы</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {experts.filter(e => subscribedExperts.includes(e.id)).map(expert => (
                    <div key={expert.id} className="flex items-center gap-3 bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-xs font-bold text-white">
                        {expert.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{expert.name}</p>
                        <p className="text-xs text-gray-500">{expert.specialty} • {expert.totalPredictions} прогнозов</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-400">{expert.winRate}%</p>
                          <p className="text-[10px] text-gray-500">проходимость</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/80 via-gray-800/50 to-emerald-900/10 border-gray-700/50 mt-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${tier.bg} ${tier.color} flex items-center justify-center`}>
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Текущий тариф: {tier.label}</h3>
                    <p className="text-xs text-gray-500">
                      {currentUser.tier === 'free' && 'Базовый доступ к прогнозам'}
                      {currentUser.tier === 'pro' && 'Расширенная аналитика и прогнозы'}
                      {currentUser.tier === 'vip' && 'Полный доступ ко всем функциям'}
                    </p>
                  </div>
                </div>
                {currentUser.tier !== 'vip' && (
                  <Button
                    size="sm"
                    onClick={() => setSubscriptionModalOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs"
                  >
                    Улучшить
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className={`rounded-lg p-2.5 text-center border ${currentUser.tier === 'free' ? 'bg-gray-700/30 border-gray-600/30' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                  <span className="text-[10px] text-gray-400 block">Прогнозов/день</span>
                  <span className="text-sm font-bold text-white">{currentUser.tier === 'free' ? '3' : '∞'}</span>
                </div>
                <div className={`rounded-lg p-2.5 text-center border ${currentUser.tier === 'free' ? 'bg-gray-700/30 border-gray-600/30' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                  <span className="text-[10px] text-gray-400 block">Эксперты</span>
                  <span className="text-sm font-bold text-white">{currentUser.tier === 'free' ? 'Базовые' : 'Все'}</span>
                </div>
                <div className={`rounded-lg p-2.5 text-center border ${currentUser.tier === 'free' ? 'bg-gray-700/30 border-gray-600/30' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                  <span className="text-[10px] text-gray-400 block">Аналитика</span>
                  <span className="text-sm font-bold text-white">{currentUser.tier === 'vip' ? 'Полная' : currentUser.tier === 'pro' ? 'Расширенная' : 'Базовая'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings tab */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  Профиль
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name */}
                <div className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30">
                  <div>
                    <p className="text-sm text-white">Имя</p>
                    <p className="text-xs text-gray-500">{currentUser.name}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-emerald-400 hover:text-emerald-300" onClick={() => handleEditProfile('name')}>
                    Изменить
                  </Button>
                </div>
                {/* Email */}
                <div className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30">
                  <div>
                    <p className="text-sm text-white">Email</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-emerald-400 hover:text-emerald-300" onClick={() => handleEditProfile('email')}>
                    Изменить
                  </Button>
                </div>
                {/* Password */}
                <div className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30">
                  <div>
                    <p className="text-sm text-white">Пароль</p>
                    <p className="text-xs text-gray-500">Установите надёжный пароль</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-emerald-400 hover:text-emerald-300" onClick={() => handleEditProfile('password')}>
                    Сменить
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-400" />
                  Уведомления
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/30">
                    <div>
                      <p className="text-sm text-white">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={() => handleToggleNotification(item.id)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Logout */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Выйти из аккаунта</h3>
                    <p className="text-xs text-gray-500">Вы будете перенаправлены на главную страницу</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogoutRequest}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1.5" />
                    Выйти
                  </Button>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-gray-600">
              Версия 2.0 • ФаворитПро © 2026
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Logout confirmation dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-[#151b23] border-gray-700/50">
          <DialogHeader>
            <DialogTitle className="text-white">Подтверждение выхода</DialogTitle>
            <DialogDescription className="text-gray-400">
              Вы уверены, что хотите выйти из аккаунта? Для повторного входа потребуется авторизация.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setLogoutDialogOpen(false)} className="border-gray-600 text-gray-300">
              <X className="w-3.5 h-3.5 mr-1" />
              Отмена
            </Button>
            <Button size="sm" onClick={handleLogoutConfirm} className="bg-red-500 hover:bg-red-600 text-white">
              <Check className="w-3.5 h-3.5 mr-1" />
              Выйти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit profile dialog */}
      <Dialog open={editingField !== null} onOpenChange={(open) => { if (!open) { setEditingField(null); setEditValue(''); } }}>
        <DialogContent className="bg-[#151b23] border-gray-700/50">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingField === 'name' && 'Изменить имя'}
              {editingField === 'email' && 'Изменить email'}
              {editingField === 'password' && 'Сменить пароль'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingField === 'name' && 'Введите новое имя'}
              {editingField === 'email' && 'Введите новый email'}
              {editingField === 'password' && 'Введите новый пароль (мин. 8 символов)'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <input
              type={editingField === 'password' ? 'password' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveProfile()}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder={
                editingField === 'name' ? 'Ваше имя' :
                editingField === 'email' ? 'email@example.com' :
                'Новый пароль'
              }
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditingField(null)} className="border-gray-600 text-gray-300">
              Отмена
            </Button>
            <Button size="sm" onClick={handleSaveProfile} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prediction detail modal */}
      <Suspense fallback={null}>
        <LazyPredictionDetailModal
          prediction={selectedPrediction ? {
            id: selectedPrediction.id,
            expertId: '',
            expertName: selectedPrediction.expertName,
            matchId: '',
            sport: 'football',
            matchTitle: selectedPrediction.matchTitle,
            prediction: selectedPrediction.prediction,
            odds: selectedPrediction.odds,
            confidence: 50,
            analysis: '',
            createdAt: '',
          } : null}
          open={predictionModalOpen}
          onClose={() => { setPredictionModalOpen(false); setSelectedPrediction(null); }}
        />
      </Suspense>
    </div>
  );
}
