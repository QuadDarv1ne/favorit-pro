import { UserProfile } from '@/stores/app-store';

export const DEMO_USER: UserProfile = {
  id: 'demo-user',
  name: 'Демо Пользователь',
  email: 'demo@favoritpro.ru',
  avatar: 'ДП',
  role: 'user',
  tier: 'free',
  balance: 3500,
  totalBets: 47,
  wonBets: 31,
  totalProfit: 12400,
  joinedAt: '01.03.2026',
};

export function createDemoUser(): UserProfile {
  return { ...DEMO_USER };
}
