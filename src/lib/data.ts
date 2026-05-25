// Моковые данные для сайта прогнозов букмекерских событий

export interface Match {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  startTime: string;
  status: 'live' | 'upcoming' | 'finished';
  homeScore?: number;
  awayScore?: number;
  prediction?: string;
  confidence?: number;
  isHot?: boolean;
}

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  winRate: number;
  totalPredictions: number;
  roi: number;
  streak: number;
  lastResults: ('W' | 'L')[];
  bio?: string;
}

export interface Prediction {
  id: string;
  expertId: string;
  expertName: string;
  matchId: string;
  sport: string;
  matchTitle: string;
  prediction: string;
  odds: number;
  confidence: number;
  analysis: string;
  createdAt: string;
  result?: 'win' | 'loss' | 'pending';
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  publishedAt: string;
  readTime: number;
}

export interface SportCategory {
  id: string;
  name: string;
  icon: string;
  matchCount: number;
  color: string;
}

export const sportCategories: SportCategory[] = [
  { id: 'football', name: 'Футбол', icon: '⚽', matchCount: 48, color: 'from-green-500 to-emerald-600' },
  { id: 'hockey', name: 'Хоккей', icon: '🏒', matchCount: 24, color: 'from-cyan-500 to-blue-600' },
  { id: 'basketball', name: 'Баскетбол', icon: '🏀', matchCount: 18, color: 'from-orange-500 to-red-600' },
  { id: 'tennis', name: 'Теннис', icon: '🎾', matchCount: 32, color: 'from-yellow-500 to-amber-600' },
  { id: 'cybersport', name: 'Киберспорт', icon: '🎮', matchCount: 15, color: 'from-purple-500 to-violet-600' },
  { id: 'volleyball', name: 'Волейбол', icon: '🏐', matchCount: 12, color: 'from-pink-500 to-rose-600' },
];

export const liveMatches: Match[] = [
  {
    id: '1', sport: 'football', league: 'РПЛ',
    homeTeam: 'Спартак', awayTeam: 'ЦСКА',
    homeOdds: 2.10, drawOdds: 3.30, awayOdds: 3.50,
    startTime: '21:00', status: 'live',
    homeScore: 1, awayScore: 1,
    prediction: 'ТМ 2.5', confidence: 72, isHot: true,
  },
  {
    id: '2', sport: 'football', league: 'АПЛ',
    homeTeam: 'Арсенал', awayTeam: 'Челси',
    homeOdds: 1.75, drawOdds: 3.80, awayOdds: 4.50,
    startTime: '22:30', status: 'live',
    homeScore: 2, awayScore: 0,
    prediction: 'Ф1(-1)', confidence: 68,
  },
  {
    id: '3', sport: 'hockey', league: 'КХЛ',
    homeTeam: 'Ак Барс', awayTeam: 'СКА',
    homeOdds: 2.25, drawOdds: 3.60, awayOdds: 2.90,
    startTime: '19:00', status: 'live',
    homeScore: 3, awayScore: 2,
    prediction: 'ТБ 4.5', confidence: 65,
  },
  {
    id: '4', sport: 'basketball', league: 'Единая Лига ВТБ',
    homeTeam: 'ЦСКА М', awayTeam: 'Химки',
    homeOdds: 1.25, awayOdds: 3.80,
    startTime: '20:00', status: 'live',
    homeScore: 45, awayScore: 38,
    prediction: 'Ф1(-8.5)', confidence: 74,
  },
  {
    id: '5', sport: 'tennis', league: 'Roland Garros',
    homeTeam: 'Медведев', awayTeam: 'Циципас',
    homeOdds: 1.90, awayOdds: 1.90,
    startTime: '16:00', status: 'live',
    homeScore: 0, awayScore: 0,
    prediction: 'П1', confidence: 58,
  },
  {
    id: '6', sport: 'cybersport', league: 'DreamLeague S29',
    homeTeam: 'Team Spirit', awayTeam: 'Tundra',
    homeOdds: 1.65, awayOdds: 2.20,
    startTime: '18:00', status: 'live',
    prediction: 'П1', confidence: 62, isHot: true,
  },
];

export const upcomingMatches: Match[] = [
  {
    id: '7', sport: 'football', league: 'Лига Чемпионов',
    homeTeam: 'Реал Мадрид', awayTeam: 'Ман Сити',
    homeOdds: 2.40, drawOdds: 3.30, awayOdds: 2.90,
    startTime: 'Завтра 22:00', status: 'upcoming',
    prediction: 'Обе забьют - Да', confidence: 76, isHot: true,
  },
  {
    id: '8', sport: 'football', league: 'Серия А',
    homeTeam: 'Интер', awayTeam: 'Ювентус',
    homeOdds: 1.85, drawOdds: 3.50, awayOdds: 4.20,
    startTime: 'Завтра 21:45', status: 'upcoming',
    prediction: 'Ф1(0)', confidence: 70,
  },
  {
    id: '9', sport: 'hockey', league: 'НХЛ',
    homeTeam: 'Тампа Бэй', awayTeam: 'Флорида',
    homeOdds: 2.10, drawOdds: 3.80, awayOdds: 2.95,
    startTime: 'Завтра 02:00', status: 'upcoming',
    prediction: 'ТБ 5.5', confidence: 63,
  },
  {
    id: '10', sport: 'football', league: 'Бундеслига',
    homeTeam: 'Бавария', awayTeam: 'Дортмунд',
    homeOdds: 1.55, drawOdds: 4.10, awayOdds: 5.50,
    startTime: 'Завтра 19:30', status: 'upcoming',
    prediction: 'П1', confidence: 78, isHot: true,
  },
  {
    id: '11', sport: 'basketball', league: 'НБА',
    homeTeam: 'Лейкерс', awayTeam: 'Селтикс',
    homeOdds: 2.05, awayOdds: 1.75,
    startTime: 'Послезавтра 03:30', status: 'upcoming',
    prediction: 'Ф2(-3.5)', confidence: 61,
  },
  {
    id: '12', sport: 'cybersport', league: 'LEC 2026 Spring',
    homeTeam: 'G2 Esports', awayTeam: 'Fnatic',
    homeOdds: 1.50, awayOdds: 2.50,
    startTime: 'Послезавтра 20:00', status: 'upcoming',
    prediction: 'П1 2-0', confidence: 55,
  },
];

export const experts: Expert[] = [
  {
    id: '1', name: 'Алексей Капперов', avatar: 'АК',
    specialty: 'Футбол', winRate: 74, totalPredictions: 892,
    roi: 23.5, streak: 7, lastResults: ['W', 'W', 'W', 'L', 'W', 'W', 'W'],
  },
  {
    id: '2', name: 'Дмитрий Шайбиц', avatar: 'ДШ',
    specialty: 'Хоккей', winRate: 69, totalPredictions: 654,
    roi: 18.2, streak: 4, lastResults: ['W', 'W', 'L', 'W', 'W', 'L', 'W'],
  },
  {
    id: '3', name: 'Мария Теннисова', avatar: 'МТ',
    specialty: 'Теннис', winRate: 71, totalPredictions: 423,
    roi: 21.7, streak: 5, lastResults: ['W', 'L', 'W', 'W', 'W', 'W', 'L'],
  },
  {
    id: '4', name: 'КиберГуру', avatar: 'КГ',
    specialty: 'Киберспорт', winRate: 67, totalPredictions: 312,
    roi: 15.8, streak: 3, lastResults: ['L', 'W', 'W', 'W', 'L', 'W', 'W'],
  },
  {
    id: '5', name: 'Сергей Аналитик', avatar: 'СА',
    specialty: 'Баскетбол', winRate: 72, totalPredictions: 567,
    roi: 19.4, streak: 6, lastResults: ['W', 'W', 'W', 'W', 'L', 'W', 'W'],
  },
  {
    id: '6', name: 'Игорь Ставкин', avatar: 'ИС',
    specialty: 'Футбол', winRate: 66, totalPredictions: 1205,
    roi: 12.3, streak: 2, lastResults: ['W', 'L', 'W', 'L', 'W', 'W', 'L'],
  },
];

export const topPredictions: Prediction[] = [
  {
    id: 'p1', expertId: '1', expertName: 'Алексей Капперов',
    matchId: '7', sport: 'football',
    matchTitle: 'Реал Мадрид — Ман Сити',
    prediction: 'Обе забьют - Да', odds: 1.75, confidence: 76,
    analysis: 'Обе команды имеют мощную атаку. В последних 5 матчах Реал забивал минимум 2 гола, а Ман Сити — в 8 из 10 последних игр. С учёте необходимости забивать в ЛЧ, ожидаем результативный матч.',
    createdAt: '2 часа назад', result: 'pending',
  },
  {
    id: 'p2', expertId: '5', expertName: 'Сергей Аналитик',
    matchId: '4', sport: 'basketball',
    matchTitle: 'ЦСКА М — Химки',
    prediction: 'Ф1(-8.5)', odds: 1.85, confidence: 74,
    analysis: 'ЦСКА дома мощно играет, средняя разница — 12 очков. Химки в плохой форме на выезде: 3 поражения подряд с разницей более 10 очков.',
    createdAt: '3 часа назад', result: 'pending',
  },
  {
    id: 'p3', expertId: '2', expertName: 'Дмитрий Шайбиц',
    matchId: '3', sport: 'hockey',
    matchTitle: 'Ак Барс — СКА',
    prediction: 'ТБ 4.5', odds: 1.90, confidence: 65,
    analysis: 'Личные встречи этих команд регулярно результативны. 7 из 10 последних матчей завершились с общим тоталом больше 4.5. Обе команды играют в атакующий хоккей.',
    createdAt: '4 часа назад', result: 'pending',
  },
  {
    id: 'p4', expertId: '1', expertName: 'Алексей Капперов',
    matchId: '10', sport: 'football',
    matchTitle: 'Бавария — Дортмунд',
    prediction: 'П1', odds: 1.55, confidence: 78,
    analysis: 'Бавария дома в Бундеслиге — почти непобедима. 18 побед в 20 домашних матчах. Дортмунд на выезде нестабилен, особенно в топ-матчах.',
    createdAt: '5 часов назад', result: 'pending',
  },
];

export const newsItems: NewsItem[] = [
  {
    id: 'n1',
    title: '«Трактор» сохранил молодых игроков: клуб сделал квалификационные предложения',
    excerpt: 'Хоккейный клуб «Трактор» объявил о сохранении ключевых молодых игроков команды. Клуб сделал квалификационные предложения нескольким перспективным хоккеистам, что позволит сохранить костяк команды на следующий сезон.',
    category: 'Хоккей',
    image: '/hockey-tractor.jpg',
    publishedAt: '20.05.2026',
    readTime: 3,
  },
  {
    id: 'n2',
    title: 'УЕФА изменит систему отбора на чемпионаты мира и Европы после Евро-2028',
    excerpt: 'УЕФА анонсировал масштабные изменения в системе отбора на крупнейшие турниры. Новая схема будет внедрена после Евро-2028 и затронет формат группового этапа и стыковых матчей.',
    category: 'Футбол',
    image: '/uefa.jpg',
    publishedAt: '20.05.2026',
    readTime: 5,
  },
  {
    id: 'n3',
    title: 'Рафф остаётся в «Баффало»: контракт с главным тренером продлён до 2028',
    excerpt: '«Баффало Сэйбрз» продлили контракт с главным тренером Линди Раффом до 2028 года. Под его руководством команда показала значительный прогресс в текущем сезоне.',
    category: 'Хоккей',
    image: '/ruff.jpg',
    publishedAt: '20.05.2026',
    readTime: 4,
  },
  {
    id: 'n4',
    title: 'Team Spirit одержала победу в DreamLeague S29',
    excerpt: 'Российская киберспортивная организация Team Spirit стала победителем DreamLeague Season 29, обыграв в финале Tundra Esports со счётом 3:1.',
    category: 'Киберспорт',
    image: '/spirit.jpg',
    publishedAt: '19.05.2026',
    readTime: 3,
  },
  {
    id: 'n5',
    title: 'Медведев вышел в полуфинал Roland Garros',
    excerpt: 'Даниил Медведев обыграл Стефаноса Циципаса в четырёх сетах и вышел в полуфинал Открытого чемпионата Франции. В следующем матче его ждёт Карлос Алькарас.',
    category: 'Теннис',
    image: '/medvedev.jpg',
    publishedAt: '19.05.2026',
    readTime: 4,
  },
  {
    id: 'n6',
    title: 'Аналитический обзор: тренды ставок на РПЛ в сезоне 2025/26',
    excerpt: 'Подробный анализ трендов ставок на Российскую Премьер-Лигу. Какие рынки наиболее прибыльные, где букмекеры ошибаются чаще всего, и как использовать статистику для выигрыша.',
    category: 'Аналитика',
    image: '/rpl.jpg',
    publishedAt: '18.05.2026',
    readTime: 8,
  },
];

export const statsData = {
  totalPredictions: 3583,
  winRate: 68.5,
  avgOdds: 1.82,
  roi: 17.3,
  monthlyStats: [
    { month: 'Янв', wins: 142, losses: 58, profit: 12.4 },
    { month: 'Фев', wins: 155, losses: 62, profit: 15.8 },
    { month: 'Мар', wins: 168, losses: 55, profit: 22.1 },
    { month: 'Апр', wins: 160, losses: 60, profit: 18.6 },
    { month: 'Май', wins: 178, losses: 52, profit: 24.3 },
  ],
  sportStats: [
    { sport: 'Футбол', winRate: 71, predictions: 1450 },
    { sport: 'Хоккей', winRate: 69, predictions: 680 },
    { sport: 'Баскетбол', winRate: 72, predictions: 520 },
    { sport: 'Теннис', winRate: 70, predictions: 543 },
    { sport: 'Киберспорт', winRate: 65, predictions: 390 },
  ],
};

export const finishedMatches: Match[] = [
  {
    id: 'f1', sport: 'football', league: 'РПЛ',
    homeTeam: 'Зенит', awayTeam: 'Локомотив',
    homeOdds: 1.45, drawOdds: 4.10, awayOdds: 6.50,
    startTime: '19.05.2026', status: 'finished',
    homeScore: 3, awayScore: 1,
    prediction: 'П1', confidence: 80,
  },
  {
    id: 'f2', sport: 'hockey', league: 'КХЛ',
    homeTeam: 'Динамо М', awayTeam: 'Торпедо',
    homeOdds: 1.70, drawOdds: 3.80, awayOdds: 4.20,
    startTime: '19.05.2026', status: 'finished',
    homeScore: 4, awayScore: 3,
    prediction: 'ТБ 5.5', confidence: 62,
  },
  {
    id: 'f3', sport: 'football', league: 'АПЛ',
    homeTeam: 'Ливерпуль', awayTeam: 'Тоттенхэм',
    homeOdds: 1.50, drawOdds: 4.20, awayOdds: 5.80,
    startTime: '18.05.2026', status: 'finished',
    homeScore: 2, awayScore: 0,
    prediction: 'Ф1(-1)', confidence: 73,
  },
  {
    id: 'f4', sport: 'basketball', league: 'НБА',
    homeTeam: 'Голден Стэйт', awayTeam: 'Денвер',
    homeOdds: 1.90, awayOdds: 1.90,
    startTime: '18.05.2026', status: 'finished',
    homeScore: 112, awayScore: 105,
    prediction: 'ТБ 215.5', confidence: 67,
  },
  {
    id: 'f5', sport: 'tennis', league: 'ATP Rome',
    homeTeam: 'Алькарас', awayTeam: 'Синнер',
    homeOdds: 1.80, awayOdds: 1.95,
    startTime: '17.05.2026', status: 'finished',
    homeScore: 2, awayScore: 1,
    prediction: 'П1', confidence: 60,
  },
  {
    id: 'f6', sport: 'cybersport', league: 'CCT EU Series',
    homeTeam: 'NAVI', awayTeam: 'FaZe',
    homeOdds: 1.70, awayOdds: 2.10,
    startTime: '17.05.2026', status: 'finished',
    homeScore: 2, awayScore: 0,
    prediction: 'П1', confidence: 64,
  },
];
