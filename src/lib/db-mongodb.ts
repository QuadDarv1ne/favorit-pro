import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import type {
  Sport, Match, Expert, Prediction, User, Like, Subscription, NewsArticle,
} from '@prisma/client';

// MongoDB document extends ObjectId
type MongoId = string;

interface MongoSport extends Omit<Sport, 'id'> { _id: ObjectId; id: MongoId; }
interface MongoMatch extends Omit<Match, 'id' | 'homeScore' | 'awayScore'> { _id: ObjectId; id: MongoId; homeScore?: number; awayScore?: number; }
interface MongoExpert extends Omit<Expert, 'id'> { _id: ObjectId; id: MongoId; }
interface MongoPrediction extends Omit<Prediction, 'id'> { _id: ObjectId; id: MongoId; }
interface MongoUser extends Omit<User, 'id'> { _id: ObjectId; id: MongoId; }
interface MongoLike extends Omit<Like, 'id'> { _id: ObjectId; id: MongoId; }
interface MongoSubscription extends Omit<Subscription, 'id'> { _id: ObjectId; id: MongoId; }
interface MongoNewsArticle extends Omit<NewsArticle, 'id'> { _id: ObjectId; id: MongoId; }

/**
 * MongoDB adapter that provides a Prisma-like API for the app.
 * This allows the same API routes to work with both Prisma (SQLite/PostgreSQL) and MongoDB.
 */
export class MongoAdapter {
  private client: MongoClient;
  private db: Db | null = null;
  private _connected = false;

  constructor(uri: string) {
    this.client = new MongoClient(uri);
  }

  async connect() {
    if (this._connected) return;
    await this.client.connect();
    this.db = this.client.db();
    await this.initCollections();
    this._connected = true;
  }

  async disconnect() {
    if (this._connected) {
      await this.client.close();
      this._connected = false;
    }
  }

  get connected() {
    return this._connected;
  }

  // Collections
  private collections: {
    sport: Collection<MongoSport>;
    match: Collection<MongoMatch>;
    expert: Collection<MongoExpert>;
    prediction: Collection<MongoPrediction>;
    user: Collection<MongoUser>;
    like: Collection<MongoLike>;
    subscription: Collection<MongoSubscription>;
    newsArticle: Collection<MongoNewsArticle>;
  } | null = null;

  private async initCollections() {
    if (!this.db) throw new Error('Not connected');
    this.collections = {
      sport: this.db.collection('sport'),
      match: this.db.collection('match'),
      expert: this.db.collection('expert'),
      prediction: this.db.collection('prediction'),
      user: this.db.collection('user'),
      like: this.db.collection('like'),
      subscription: this.db.collection('subscription'),
      newsArticle: this.db.collection('newsArticle'),
    };
  }

  private get col() {
    if (!this.collections) throw new Error('Collections not initialized');
    return this.collections;
  }

  // Helper: serialize ObjectId to string id
  private serialize<T extends { _id: ObjectId }>(doc: T): Omit<T, '_id'> & { id: string } {
    const { _id, ...rest } = doc;
    return { id: _id.toHexString(), ...(rest as unknown as Omit<T, '_id'>) };
  }

  private serializeArray<T extends { _id: ObjectId }>(docs: T[]): (Omit<T, '_id'> & { id: string })[] {
    return docs.map((d) => this.serialize(d));
  }

  // ==================== SPORT ====================
  async sportFindMany(args: { where?: Record<string, unknown> } = {}) {
    const docs = await this.col.sport.find(args.where || {}).toArray();
    return this.serializeArray(docs);
  }

  async sportFindUnique(args: { where: { id: string } | { slug: string } }) {
    const query = 'id' in args.where ? { id: args.where.id } : { slug: args.where.slug };
    const doc = await this.col.sport.findOne(query as Record<string, unknown>);
    return doc ? this.serialize(doc) : null;
  }

  // ==================== MATCH ====================
  async matchFindMany(args: { where?: Record<string, unknown>; take?: number; orderBy?: Record<string, 1 | -1>; include?: Record<string, boolean> } = {}) {
    const docs = await this.col.match
      .find(args.where || {})
      .sort(args.orderBy || { startTime: 1 })
      .limit(args.take || 20)
      .toArray();
    const result = this.serializeArray(docs);
    // Basic include simulation (full relations would need separate queries)
    return result;
  }

  async matchFindUnique(args: { where: { id: string } }) {
    const doc = await this.col.match.findOne({ id: args.where.id } as Record<string, unknown>);
    return doc ? this.serialize(doc) : null;
  }

  // ==================== EXPERT ====================
  async expertFindMany(args: { where?: Record<string, unknown>; take?: number; orderBy?: Record<string, 1 | -1>; include?: Record<string, boolean> } = {}) {
    const docs = await this.col.expert
      .find(args.where || {})
      .sort(args.orderBy || { winRate: -1 })
      .limit(args.take || 20)
      .toArray();
    return this.serializeArray(docs);
  }

  async expertFindUnique(args: { where: { id: string } }) {
    const doc = await this.col.expert.findOne({ id: args.where.id } as Record<string, unknown>);
    return doc ? this.serialize(doc) : null;
  }

  // ==================== PREDICTION ====================
  async predictionFindMany(args: { where?: Record<string, unknown>; take?: number; orderBy?: Record<string, 1 | -1>; include?: Record<string, boolean> } = {}) {
    const docs = await this.col.prediction
      .find(args.where || {})
      .sort(args.orderBy || { createdAt: -1 })
      .limit(args.take || 50)
      .toArray();
    return this.serializeArray(docs);
  }

  async predictionCreate(args: { data: Record<string, unknown> }) {
    const doc = await this.col.prediction.insertOne(args.data as unknown as MongoPrediction);
    return { id: doc.insertedId.toHexString(), ...args.data } as Prediction;
  }

  // ==================== USER ====================
  async userFindUnique(args: { where: { id: string } | { email: string }; select?: Record<string, boolean> }) {
    const query = 'id' in args.where ? { id: args.where.id } : { email: args.where.email };
    const projection = args.select ? Object.fromEntries(Object.entries(args.select).filter(([, v]) => v).map(([k]) => [k, 1])) : {};
    const doc = await this.col.user.findOne(query as Record<string, unknown>, { projection });
    if (!doc) return null;
    const serialized = this.serialize(doc);
    // Handle select: remove unselected fields
    if (args.select) {
      const result = {} as typeof serialized;
      for (const [key, value] of Object.entries(args.select)) {
        if (value && key in serialized) {
          (result as Record<string, unknown>)[key] = serialized[key as keyof typeof serialized];
        }
      }
      return result;
    }
    return serialized;
  }

  async userCreate(args: { data: Record<string, unknown> }) {
    const doc = await this.col.user.insertOne(args.data as unknown as MongoUser);
    return { id: doc.insertedId.toHexString(), ...args.data } as User;
  }

  async userUpdate(args: { where: { id: string }; data: Record<string, unknown> }) {
    const { decrement, ...setData } = args.data as { decrement?: Record<string, number> };
    const update: Record<string, unknown> = { $set: setData };
    if (decrement) {
      const incDec = {} as Record<string, number>;
      for (const [key, value] of Object.entries(decrement)) {
        incDec[key] = -value;
      }
      update.$inc = incDec;
    }
    await this.col.user.updateOne({ id: args.where.id } as Record<string, unknown>, update);
    const updated = await this.col.user.findOne({ id: args.where.id } as Record<string, unknown>);
    return updated ? this.serialize(updated) as User : null;
  }

  // ==================== LIKE ====================
  async likeFindUnique(args: { where: { userId_predictionId: { userId: string; predictionId: string } } }) {
    const doc = await this.col.like.findOne({
      userId: args.where.userId_predictionId.userId,
      predictionId: args.where.userId_predictionId.predictionId,
    } as Record<string, unknown>);
    return doc ? this.serialize(doc) : null;
  }

  async likeCreate(args: { data: Record<string, unknown> }) {
    const doc = await this.col.like.insertOne(args.data as unknown as MongoLike);
    return { id: doc.insertedId.toHexString(), ...args.data } as Like;
  }

  async likeDelete(args: { where: { id: string } }) {
    await this.col.like.deleteOne({ id: args.where.id } as Record<string, unknown>);
  }

  // ==================== SUBSCRIPTION ====================
  async subscriptionFindMany(args: { where?: Record<string, unknown>; include?: Record<string, boolean> } = {}) {
    const docs = await this.col.subscription.find(args.where || {}).toArray();
    return this.serializeArray(docs);
  }

  async subscriptionFindUnique(args: { where: { id: string } | { userId_expertId: { userId: string; expertId: string } } }) {
    let query: Record<string, unknown>;
    if ('userId_expertId' in args.where) {
      query = { userId: args.where.userId_expertId.userId, expertId: args.where.userId_expertId.expertId };
    } else {
      query = { id: args.where.id };
    }
    const doc = await this.col.subscription.findOne(query);
    return doc ? this.serialize(doc) : null;
  }

  async subscriptionCreate(args: { data: Record<string, unknown> }) {
    const doc = await this.col.subscription.insertOne(args.data as unknown as MongoSubscription);
    return { id: doc.insertedId.toHexString(), ...args.data } as Subscription;
  }

  async subscriptionDelete(args: { where: { id: string } }) {
    await this.col.subscription.deleteOne({ id: args.where.id } as Record<string, unknown>);
  }

  // ==================== NEWS ARTICLE ====================
  async newsArticleFindMany(args: { where?: Record<string, unknown>; take?: number; orderBy?: Record<string, 1 | -1> } = {}) {
    const docs = await this.col.newsArticle
      .find(args.where || {})
      .sort(args.orderBy || { publishedAt: -1 })
      .limit(args.take || 20)
      .toArray();
    return this.serializeArray(docs);
  }

  // ==================== TRANSACTION ====================
  async $transaction<T>(fn: (tx: MongoAdapter) => Promise<T>): Promise<T> {
    // MongoDB doesn't support multi-document transactions without replica sets.
    // For single-node MongoDB, we run the function directly.
    // In production with a replica set, you'd use clientSession.startTransaction().
    return fn(this);
  }
}

let mongoInstance: MongoAdapter | null = null;

export function getMongoAdapter(uri: string): MongoAdapter {
  if (!mongoInstance) {
    mongoInstance = new MongoAdapter(uri);
  }
  return mongoInstance;
}
