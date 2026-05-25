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
  slug: string;
  excerpt: string;
  content: string; // markdown body
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
    slug: 'traktor-qualifying-offers-2026',
    excerpt: 'Хоккейный клуб «Трактор» объявил о сохранении ключевых молодых игроков команды.',
    category: 'Хоккей',
    image: '/hockey-tractor.jpg',
    publishedAt: '20.05.2026',
    readTime: 3,
    content: `## Ключевые решения «Трактора»

Хоккейный клуб **«Трактор»** объявил о сохранении ключевых молодых игроков команды. Клуб сделал квалификационные предложения нескольким перспективным хоккеистам.

### Кому предложены контракты

- **Иван Фирсов** — нападающий, 22 года, 15 голов в сезоне
- **Артём Пухкала** — вратарь, 21 год, КН 2.15
- **Сергей Калинин** — защитник, 23 года, 12 очков

> Это важное решение для будущего клуба. Мы строим команду на годы вперёд.

### Что это значит для болельщиков

Сохранение молодого костяка позволит команде стабильно выступать в плей-офф КХЛ в ближайшие сезоны.`,
  },
  {
    id: 'n2',
    title: 'УЕФА изменит систему отбора на чемпионаты мира и Европы после Евро-2028',
    slug: 'uefa-qualification-reform-2028',
    excerpt: 'УЕФА анонсировал масштабные изменения в системе отбора на крупнейшие турниры.',
    category: 'Футбол',
    image: '/uefa.jpg',
    publishedAt: '20.05.2026',
    readTime: 5,
    content: `## Реформа квалификации УЕФА

**УЕФА** анонсировал масштабные изменения в системе отбора на крупнейшие турниры. Новая схема будет внедрена после **Евро-2028**.

### Основные изменения

1. **Групповой этап** — 12 групп по 4 команды вместо текущих 10 групп
2. **Плей-офф** — расширенная система стыковых матчей
3. **Лига наций** — интеграция с квалификацией ЧМ

### Влияние на сборные

Для сборных это означает **больше матчей** и более справедливую систему отбора. Малые сборные получат больше шансов выйти на крупные турниры.

| Формат | Сейчас | После 2028 |
|--------|--------|------------|
| Группы | 10 × 5-6 | 12 × 4 |
| Прямые путёвки | 13 | 16 |
| Плей-офф | 3 | 4 |

### Мнение экспертов

> Это долгожданная реформа, которая сделает отбор более зрелищным и справедливым.`,
  },
  {
    id: 'n3',
    title: 'Как читать коэффициенты букмекеров: гид для начинающих',
    slug: 'bookmaker-odds-guide-beginners',
    excerpt: 'Полный гид по пониманию коэффициентов букмекеров. Разбираемся в форматах, марже и价值 ставок.',
    category: 'Аналитика',
    image: '/odds-guide.jpg',
    publishedAt: '21.05.2026',
    readTime: 7,
    content: `## Как читать коэффициенты букмекеров

Понимание коэффициентов — **базовый навык** для любого, кто интересуется ставками на спорт.

### Форматы коэффициентов

#### Десятичный формат (европейский)
Самый популярный формат в России и Европе. Коэффициент **1.85** означает, что при ставке 1000₽ вы получите **1850₽** (прибыль 850₽).

#### Дробный формат (британский)
Коэффициент **5/2** означает, что на каждые 2 единицы ставки вы получите 5 единиц выигрыша.

#### Американский формат
**+150** — при ставке $100 выигрыш составит $150. **-200** — нужно поставить $200, чтобы выиграть $100.

### Что такое маржа букмекера

**Маржа** — это комиссия букмекера, заложенная в коэффициенты.

\`\`\`
Маржа = (1 / К1 + 1 / КX + 1 / К2 - 1) × 100%
\`\`\`

Чем ниже маржа, тем **выгоднее** коэффициенты для игрока.

### Как найти價值 ставку

1. Оцените реальную вероятность исхода
2. Переведите в коэффициент: \`К = 1 / вероятность\`
3. Сравните с коэффициентом букмекера
4. Если ваш коэффициент **ниже** — ставка имеет ценность

> **Важно:** Никогда не ставьте больше, чем можете позволить себе потерять.`,
  },
  {
    id: 'n4',
    title: 'Team Spirit одержала победу в DreamLeague S29',
    slug: 'team-spirit-dreamleague-s29',
    excerpt: 'Российская киберспортивная организация Team Spirit стала победителем DreamLeague Season 29.',
    category: 'Киберспорт',
    image: '/spirit.jpg',
    publishedAt: '19.05.2026',
    readTime: 3,
    content: `## Победа Team Spirit в DreamLeague S29

**Team Spirit** стала победителем **DreamLeague Season 29**, обыграв в финале Tundra Esports со счётом **3:1**.

### Путь к финалу

| Стадия | Соперник | Счёт |
|--------|----------|------|
| Групповой этап | — | 5-1 |
| Четвертьфинал | G2 Esports | 2:0 |
| Полуфинал | Fnatic | 2:1 |
| Финал | Tundra Esports | 3:1 |

### Ключевые игроки

- **Yatoro** — MVP турнира, средний KDA 4.2
- **TORONTOTOKYO** — лучший по урону на турнире
- **Collapse** — 78% винрейт на оффлейне

### Призовые

Команда получила **$400,000** призовых и **1200 DPC-очков**.`,
  },
  {
    id: 'n5',
    title: 'Медведев вышел в полуфинал Roland Garros',
    slug: 'medvedev-roland-garros-semifinal',
    excerpt: 'Даниил Медведев обыграл Стефаноса Циципаса в четырёх сетах и вышел в полуфинал.',
    category: 'Теннис',
    image: '/medvedev.jpg',
    publishedAt: '19.05.2026',
    readTime: 4,
    content: `## Медведев в полуфинале Roland Garros

**Даниил Медведев** обыграл Стефаноса Циципаса в четырёх сетах и вышел в полуфинал **Открытого чемпионата Франции**.

### Результаты матча

| Сет | Медведев | Циципас |
|-----|----------|---------|
| 1 | 6 | 4 |
| 2 | 3 | 6 |
| 3 | 7 | 5 |
| 4 | 6 | 3 |

### Статистика матча

- **Эйсы:** Медведев 12 — 8 Циципас
- **Двойные ошибки:** 3 — 5
- **Реализованные брейк-пойнты:** 4/9 — 2/7
- **Выигранные очки на первой подаче:** 78% — 65%

### Полуфинал

В полуфинале Медведев встретится с **Карлосом Алькарасом**, который в своём матче обыграл Янника Зиннера.`,
  },
  {
    id: 'n6',
    title: 'Аналитический обзор: тренды ставок на РПЛ в сезоне 2025/26',
    slug: 'rpl-betting-trends-2025-26',
    excerpt: 'Подробный анализ трендов ставок на Российскую Премьер-Лигу.',
    category: 'Аналитика',
    image: '/rpl.jpg',
    publishedAt: '18.05.2026',
    readTime: 8,
    content: `## Тренды ставок на РПЛ 2025/26

Подробный анализ трендов ставок на **Российскую Премьер-Лигу**. Разбираемся, какие рынки наиболее прибыльные и где букмекеры ошибаются чаще всего.

### Общая статистика сезона

| Показатель | Значение |
|------------|----------|
| Всего матчей | 240 |
| Средний тотал | 2.63 гола |
| Побед хозяев | 44% |
| Ничьих | 26% |
| Побед гостей | 30% |

### Самые прибыльные рынки

1. **ТБ 2.5** — проходимость 52%, средний коэффициент 1.85, ROI +8.2%
2. **Обе забьют** — проходимость 48%, средний коэффициент 1.90, ROI +5.4%
3. **Фора хозяина (-1)** — проходимость 31%, средний коэффициент 2.40, ROI +3.1%

### Где ошибаются букмекеры

Анализ показал, что букмекеры **систематически занижают** коэффициент на тотал больше в матчах с участием **«Зенита»** и **«Спартака»**.

> Это связано с высокой популярностью этих команд среди бетторов.

### Рекомендации

- Ставьте **ТБ 2.5** в матчах «Зенита» на выезде
- **Обе забьют** в дерби «Спартак» — «ЦСКА» заходит в 65% случаев
- Избегайте ставок на аутсайдеров в конце сезона`,
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
