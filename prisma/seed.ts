import { db } from '@/lib/db';

async function seed() {
  // Seed sports
  const sports = await Promise.all([
    db.sport.upsert({ where: { slug: 'football' }, update: {}, create: { name: 'Футбол', slug: 'football', icon: '⚽', color: 'from-green-500 to-emerald-600', matchCount: 48 } }),
    db.sport.upsert({ where: { slug: 'hockey' }, update: {}, create: { name: 'Хоккей', slug: 'hockey', icon: '🏒', color: 'from-cyan-500 to-blue-600', matchCount: 24 } }),
    db.sport.upsert({ where: { slug: 'basketball' }, update: {}, create: { name: 'Баскетбол', slug: 'basketball', icon: '🏀', color: 'from-orange-500 to-red-600', matchCount: 18 } }),
    db.sport.upsert({ where: { slug: 'tennis' }, update: {}, create: { name: 'Теннис', slug: 'tennis', icon: '🎾', color: 'from-yellow-500 to-amber-600', matchCount: 32 } }),
    db.sport.upsert({ where: { slug: 'cybersport' }, update: {}, create: { name: 'Киберспорт', slug: 'cybersport', icon: '🎮', color: 'from-purple-500 to-violet-600', matchCount: 15 } }),
    db.sport.upsert({ where: { slug: 'volleyball' }, update: {}, create: { name: 'Волейбол', slug: 'volleyball', icon: '🏐', color: 'from-pink-500 to-rose-600', matchCount: 12 } }),
  ]);

  // Seed experts
  const experts = await Promise.all([
    db.expert.create({ data: { name: 'Алексей Капперов', avatar: 'АК', specialtyId: sports[0].id, winRate: 74, totalPredictions: 892, roi: 23.5, streak: 7, lastResults: 'W,W,W,L,W,W,W', bio: 'Топовый футбольный аналитик с 10-летним опытом. Специализация — РПЛ и топ-лиги Европы.' } }),
    db.expert.create({ data: { name: 'Дмитрий Шайбиц', avatar: 'ДШ', specialtyId: sports[1].id, winRate: 69, totalPredictions: 654, roi: 18.2, streak: 4, lastResults: 'W,W,L,W,W,L,W', bio: 'Хоккейный эксперт. КХЛ, НХЛ — лучшие прогнозы на ледовые баталии.' } }),
    db.expert.create({ data: { name: 'Мария Теннисова', avatar: 'МТ', specialtyId: sports[3].id, winRate: 71, totalPredictions: 423, roi: 21.7, streak: 5, lastResults: 'W,L,W,W,W,W,L', bio: 'Профессиональный теннисный аналитик. ATP, WTA, Grand Slam — всё под контролем.' } }),
    db.expert.create({ data: { name: 'КиберГуру', avatar: 'КГ', specialtyId: sports[4].id, winRate: 67, totalPredictions: 312, roi: 15.8, streak: 3, lastResults: 'L,W,W,W,L,W,W', bio: 'Dota 2, CS2, LoL — глубокая аналитика киберспортивных матчей.' } }),
    db.expert.create({ data: { name: 'Сергей Аналитик', avatar: 'СА', specialtyId: sports[2].id, winRate: 72, totalPredictions: 567, roi: 19.4, streak: 6, lastResults: 'W,W,W,W,L,W,W', bio: 'Баскетбольный каппер. НБА, Евролига, ВТБ — профессиональный подход.' } }),
    db.expert.create({ data: { name: 'Игорь Ставкин', avatar: 'ИС', specialtyId: sports[0].id, winRate: 66, totalPredictions: 1205, roi: 12.3, streak: 2, lastResults: 'W,L,W,L,W,W,L', bio: 'Многоопытный футбольный каппер с огромной выборкой прогнозов.' } }),
  ]);

  // Seed matches
  const now = new Date();
  const matches = await Promise.all([
    // Live matches
    db.match.create({ data: { sportId: sports[0].id, league: 'РПЛ', homeTeam: 'Спартак', awayTeam: 'ЦСКА', homeOdds: 2.10, drawOdds: 3.30, awayOdds: 3.50, startTime: now, status: 'live', homeScore: 1, awayScore: 1, isHot: true } }),
    db.match.create({ data: { sportId: sports[0].id, league: 'АПЛ', homeTeam: 'Арсенал', awayTeam: 'Челси', homeOdds: 1.75, drawOdds: 3.80, awayOdds: 4.50, startTime: now, status: 'live', homeScore: 2, awayScore: 0 } }),
    db.match.create({ data: { sportId: sports[1].id, league: 'КХЛ', homeTeam: 'Ак Барс', awayTeam: 'СКА', homeOdds: 2.25, drawOdds: 3.60, awayOdds: 2.90, startTime: now, status: 'live', homeScore: 3, awayScore: 2 } }),
    db.match.create({ data: { sportId: sports[2].id, league: 'Единая Лига ВТБ', homeTeam: 'ЦСКА М', awayTeam: 'Химки', homeOdds: 1.25, awayOdds: 3.80, startTime: now, status: 'live', homeScore: 45, awayScore: 38 } }),
    db.match.create({ data: { sportId: sports[3].id, league: 'Roland Garros', homeTeam: 'Медведев', awayTeam: 'Циципас', homeOdds: 1.90, awayOdds: 1.90, startTime: now, status: 'live' } }),
    db.match.create({ data: { sportId: sports[4].id, league: 'DreamLeague S29', homeTeam: 'Team Spirit', awayTeam: 'Tundra', homeOdds: 1.65, awayOdds: 2.20, startTime: now, status: 'live', isHot: true } }),
    // Upcoming matches
    db.match.create({ data: { sportId: sports[0].id, league: 'Лига Чемпионов', homeTeam: 'Реал Мадрид', awayTeam: 'Ман Сити', homeOdds: 2.40, drawOdds: 3.30, awayOdds: 2.90, startTime: new Date(now.getTime() + 86400000), status: 'upcoming', isHot: true } }),
    db.match.create({ data: { sportId: sports[0].id, league: 'Серия А', homeTeam: 'Интер', awayTeam: 'Ювентус', homeOdds: 1.85, drawOdds: 3.50, awayOdds: 4.20, startTime: new Date(now.getTime() + 86400000), status: 'upcoming' } }),
    db.match.create({ data: { sportId: sports[1].id, league: 'НХЛ', homeTeam: 'Тампа Бэй', awayTeam: 'Флорида', homeOdds: 2.10, drawOdds: 3.80, awayOdds: 2.95, startTime: new Date(now.getTime() + 86400000), status: 'upcoming' } }),
    db.match.create({ data: { sportId: sports[0].id, league: 'Бундеслига', homeTeam: 'Бавария', awayTeam: 'Дортмунд', homeOdds: 1.55, drawOdds: 4.10, awayOdds: 5.50, startTime: new Date(now.getTime() + 86400000), status: 'upcoming', isHot: true } }),
    db.match.create({ data: { sportId: sports[2].id, league: 'НБА', homeTeam: 'Лейкерс', awayTeam: 'Селтикс', homeOdds: 2.05, awayOdds: 1.75, startTime: new Date(now.getTime() + 172800000), status: 'upcoming' } }),
    db.match.create({ data: { sportId: sports[4].id, league: 'LEC 2026 Spring', homeTeam: 'G2 Esports', awayTeam: 'Fnatic', homeOdds: 1.50, awayOdds: 2.50, startTime: new Date(now.getTime() + 172800000), status: 'upcoming' } }),
    // Finished matches
    db.match.create({ data: { sportId: sports[0].id, league: 'РПЛ', homeTeam: 'Зенит', awayTeam: 'Локомотив', homeOdds: 1.45, drawOdds: 4.10, awayOdds: 6.50, startTime: new Date(now.getTime() - 86400000), status: 'finished', homeScore: 3, awayScore: 1 } }),
    db.match.create({ data: { sportId: sports[1].id, league: 'КХЛ', homeTeam: 'Динамо М', awayTeam: 'Торпедо', homeOdds: 1.70, drawOdds: 3.80, awayOdds: 4.20, startTime: new Date(now.getTime() - 86400000), status: 'finished', homeScore: 4, awayScore: 3 } }),
    db.match.create({ data: { sportId: sports[0].id, league: 'АПЛ', homeTeam: 'Ливерпуль', awayTeam: 'Тоттенхэм', homeOdds: 1.50, drawOdds: 4.20, awayOdds: 5.80, startTime: new Date(now.getTime() - 172800000), status: 'finished', homeScore: 2, awayScore: 0 } }),
  ]);

  // Seed predictions
  await Promise.all([
    db.prediction.create({ data: { expertId: experts[0].id, matchId: matches[6].id, prediction: 'Обе забьют - Да', odds: 1.75, confidence: 76, analysis: 'Обе команды имеют мощную атаку. В последних 5 матчах Реал забивал минимум 2 гола, а Ман Сити — в 8 из 10 последних игр.', result: 'pending' } }),
    db.prediction.create({ data: { expertId: experts[4].id, matchId: matches[3].id, prediction: 'Ф1(-8.5)', odds: 1.85, confidence: 74, analysis: 'ЦСКА дома мощно играет, средняя разница — 12 очков. Химки в плохой форме на выезде.', result: 'pending' } }),
    db.prediction.create({ data: { expertId: experts[1].id, matchId: matches[2].id, prediction: 'ТБ 4.5', odds: 1.90, confidence: 65, analysis: '7 из 10 последних личных встреч завершились с тоталом больше 4.5.', result: 'pending' } }),
    db.prediction.create({ data: { expertId: experts[0].id, matchId: matches[9].id, prediction: 'П1', odds: 1.55, confidence: 78, analysis: 'Бавария дома в Бундеслиге — почти непобедима. 18 побед в 20 домашних матчах.', result: 'pending' } }),
    db.prediction.create({ data: { expertId: experts[3].id, matchId: matches[5].id, prediction: 'П1', odds: 1.65, confidence: 62, analysis: 'Team Spirit в отличной форме после победы на Major. Tundra нестабильны в late game.', result: 'pending' } }),
    db.prediction.create({ data: { expertId: experts[2].id, matchId: matches[4].id, prediction: 'П1', odds: 1.90, confidence: 58, analysis: 'Медведев хорошо играет на харде, но грунт — не его специализация. Однако форма растёт.', result: 'pending' } }),
    // Finished predictions (win/loss)
    db.prediction.create({ data: { expertId: experts[0].id, matchId: matches[12].id, prediction: 'П1', odds: 1.45, confidence: 80, analysis: 'Зенит дома — фаворит. 3:1 подтверждает прогноз.', result: 'win' } }),
    db.prediction.create({ data: { expertId: experts[1].id, matchId: matches[13].id, prediction: 'ТБ 5.5', odds: 1.85, confidence: 62, analysis: 'Результативный матч — 4:3, но тотал 7 больше 5.5!', result: 'win' } }),
    db.prediction.create({ data: { expertId: experts[0].id, matchId: matches[14].id, prediction: 'Ф1(-1)', odds: 1.80, confidence: 73, analysis: 'Ливерпуль уверенно выиграл 2:0. Фора прошла!', result: 'win' } }),
  ]);

  // Seed news
  await Promise.all([
    db.newsArticle.create({ data: { title: '«Трактор» сохранил молодых игроков: клуб сделал квалификационные предложения', excerpt: 'Хоккейный клуб «Трактор» объявил о сохранении ключевых молодых игроков команды на следующий сезон.', category: 'Хоккей', readTime: 3 } }),
    db.newsArticle.create({ data: { title: 'УЕФА изменит систему отбора на чемпионаты мира и Европы после Евро-2028', excerpt: 'УЕФА анонсировал масштабные изменения в системе отбора на крупнейшие турниры.', category: 'Футбол', readTime: 5 } }),
    db.newsArticle.create({ data: { title: 'Team Spirit одержала победу в DreamLeague S29', excerpt: 'Российская киберспортивная организация Team Spirit стала победителем DreamLeague Season 29.', category: 'Киберспорт', readTime: 3 } }),
    db.newsArticle.create({ data: { title: 'Медведев вышел в полуфинал Roland Garros', excerpt: 'Даниил Медведев обыграл Стефаноса Циципаса в четырёх сетах и вышел в полуфинал.', category: 'Теннис', readTime: 4 } }),
    db.newsArticle.create({ data: { title: 'Аналитический обзор: тренды ставок на РПЛ в сезоне 2025/26', excerpt: 'Подробный анализ трендов ставок на Российскую Премьер-Лигу и прибыльные рынки.', category: 'Аналитика', readTime: 8 } }),
    db.newsArticle.create({ data: { title: 'Рафф остаётся в «Баффало»: контракт продлён до 2028', excerpt: '«Баффало Сэйбрз» продлили контракт с главным тренером Линди Раффом до 2028 года.', category: 'Хоккей', readTime: 4 } }),
  ]);

  console.log('✅ Seed completed successfully!');
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());
