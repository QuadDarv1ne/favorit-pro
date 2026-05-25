/**
 * MongoDB seed script — seeds the same data as prisma/seed.ts but for MongoDB.
 * Run with: npm run db:seed:mongo
 */
import { MongoClient, ObjectId } from 'mongodb';

const DATABASE_URL = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/favoritpro';

const sports = [
  { id: new ObjectId().toHexString(), name: 'Football', slug: 'football', icon: '⚽', color: 'from-green-500 to-emerald-600', matchCount: 156 },
  { id: new ObjectId().toHexString(), name: 'Hockey', slug: 'hockey', icon: '🏒', color: 'from-blue-500 to-cyan-600', matchCount: 89 },
  { id: new ObjectId().toHexString(), name: 'Basketball', slug: 'basketball', icon: '🏀', color: 'from-orange-500 to-amber-600', matchCount: 124 },
  { id: new ObjectId().toHexString(), name: 'Tennis', slug: 'tennis', icon: '🎾', color: 'from-yellow-500 to-lime-600', matchCount: 67 },
  { id: new ObjectId().toHexString(), name: 'Cybersport', slug: 'cybersport', icon: '🎮', color: 'from-purple-500 to-violet-600', matchCount: 201 },
  { id: new ObjectId().toHexString(), name: 'Volleyball', slug: 'volleyball', icon: '🏐', color: 'from-pink-500 to-rose-600', matchCount: 45 },
];

const experts = [
  { id: new ObjectId().toHexString(), name: 'Алексей Капперов', avatar: 'АК', specialtyId: sports[0].id, winRate: 78, totalPredictions: 342, roi: 15, streak: 5, lastResults: 'W,W,W,L,W,W,L,W,W,W', bio: 'Эксперт по футболу с 10-летним опытом.' },
  { id: new ObjectId().toHexString(), name: 'Дмитрий Хоккейкин', avatar: 'ДХ', specialtyId: sports[1].id, winRate: 72, totalPredictions: 256, roi: 12, streak: 3, lastResults: 'W,L,W,W,L,W,W,L,W,W', bio: 'Специалист по КХЛ и НХЛ.' },
  { id: new ObjectId().toHexString(), name: 'Елена Баскетова', avatar: 'ЕБ', specialtyId: sports[2].id, winRate: 75, totalPredictions: 198, roi: 14, streak: 4, lastResults: 'W,W,L,W,W,W,L,W,L,W', bio: 'Аналитик NBA и Евролиги.' },
  { id: new ObjectId().toHexString(), name: 'Сергей Теннисов', avatar: 'СТ', specialtyId: sports[3].id, winRate: 69, totalPredictions: 167, roi: 9, streak: 2, lastResults: 'L,W,W,L,W,W,L,W,W,L', bio: 'Эксперт по ATP и WTA турам.' },
  { id: new ObjectId().toHexString(), name: 'Анна Киберспортова', avatar: 'АК', specialtyId: sports[4].id, winRate: 81, totalPredictions: 423, roi: 18, streak: 7, lastResults: 'W,W,W,W,L,W,W,W,W,W', bio: 'Про-игрок в CS2 и Dota 2.' },
  { id: new ObjectId().toHexString(), name: 'Игорь Волейбонов', avatar: 'ИВ', specialtyId: sports[5].id, winRate: 71, totalPredictions: 134, roi: 11, streak: 3, lastResults: 'W,L,W,W,L,W,W,L,W,W', bio: 'Аналитик мировой волейбольной лиги.' },
];

const matches = [
  { id: new ObjectId().toHexString(), sportId: sports[0].id, league: 'RPL', homeTeam: 'Зенит', awayTeam: 'ЦСКА', homeOdds: 1.85, drawOdds: 3.4, awayOdds: 4.2, startTime: new Date(), status: 'live', homeScore: 2, awayScore: 1, isHot: true },
  { id: new ObjectId().toHexString(), sportId: sports[0].id, league: 'RPL', homeTeam: 'Спартак', awayTeam: 'Локомотив', homeOdds: 2.1, drawOdds: 3.3, awayOdds: 3.5, startTime: new Date(Date.now() + 3600000), status: 'upcoming', isHot: false },
  { id: new ObjectId().toHexString(), sportId: sports[1].id, league: 'KHL', homeTeam: 'СКА', awayTeam: 'ЦСКА', homeOdds: 2.0, drawOdds: null, awayOdds: 3.2, startTime: new Date(), status: 'live', homeScore: 1, awayScore: 1, isHot: true },
  { id: new ObjectId().toHexString(), sportId: sports[2].id, league: 'NBA', homeTeam: 'Lakers', awayTeam: 'Warriors', homeOdds: 1.75, drawOdds: null, awayOdds: 2.15, startTime: new Date(Date.now() + 7200000), status: 'upcoming', isHot: true },
  { id: new ObjectId().toHexString(), sportId: sports[0].id, league: 'EPL', homeTeam: 'Arsenal', awayTeam: 'Chelsea', homeOdds: 2.05, drawOdds: 3.4, awayOdds: 3.6, startTime: new Date(Date.now() - 86400000), status: 'finished', homeScore: 3, awayScore: 1, isHot: false },
];

const predictions = [
  { id: new ObjectId().toHexString(), expertId: experts[0].id, matchId: matches[0].id, prediction: 'П1: Зенит', odds: 1.85, confidence: 85, analysis: 'Зенит в отличной форме.', result: 'pending', createdAt: new Date() },
  { id: new ObjectId().toHexString(), expertId: experts[1].id, matchId: matches[2].id, prediction: 'ТБ 4.5', odds: 2.1, confidence: 70, analysis: 'Обе команды забивают.', result: 'pending', createdAt: new Date() },
  { id: new ObjectId().toHexString(), expertId: experts[4].id, matchId: matches[3].id, prediction: 'П2: Warriors', odds: 2.15, confidence: 65, analysis: 'Warriors на подъёме.', result: 'win', createdAt: new Date(Date.now() - 86400000) },
];

const newsArticles = [
  { id: new ObjectId().toHexString(), title: 'Зенит лидирует в RPL', slug: 'zenit-leads-rpl', excerpt: 'Зенит уверенно возглавляет таблицу.', content: '# Зенит лидирует\n\nЗенит продолжает уверенно идти к чемпионству.', category: 'football', imageUrl: null, publishedAt: new Date(), readTime: 3 },
  { id: new ObjectId().toHexString(), title: 'СКА выиграл серию', slug: 'ska-wins-series', excerpt: 'СКА победил в драматичной серии.', content: '# СКА выиграл\n\nДраматичная серия завершилась победой.', category: 'hockey', imageUrl: null, publishedAt: new Date(Date.now() - 3600000), readTime: 5 },
];

async function seed() {
  console.log('[MongoDB Seed] Connecting...');
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    const db = client.db();
    console.log(`[MongoDB Seed] Connected to: ${db.databaseName}`);

    // Clear existing data
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      await db.collection(col.name).deleteMany({});
    }
    console.log('[MongoDB Seed] Cleared existing data');

    // Insert
    await db.collection('sport').insertMany(sports as any);
    console.log(`[MongoDB Seed] Inserted ${sports.length} sports`);

    await db.collection('expert').insertMany(experts as any);
    console.log(`[MongoDB Seed] Inserted ${experts.length} experts`);

    await db.collection('match').insertMany(matches as any);
    console.log(`[MongoDB Seed] Inserted ${matches.length} matches`);

    await db.collection('prediction').insertMany(predictions as any);
    console.log(`[MongoDB Seed] Inserted ${predictions.length} predictions`);

    await db.collection('newsArticle').insertMany(newsArticles as any);
    console.log(`[MongoDB Seed] Inserted ${newsArticles.length} news articles`);

    console.log('[MongoDB Seed] Done!');
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error('[MongoDB Seed] Error:', err.message);
  process.exit(1);
});
