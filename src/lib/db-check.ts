/* eslint-disable no-console */
/**
 * Database command router.
 * Detects the database type from DATABASE_URL and runs the appropriate command.
 *
 * Usage:
 *   tsx src/lib/db-check.ts push    — Prisma: db push / MongoDB: skip (schemaless)
 *   tsx src/lib/db-check.ts migrate  — Prisma: migrate dev / MongoDB: skip
 *   tsx src/lib/db-check.ts reset    — Prisma: migrate reset / MongoDB: drop collections
 *   tsx src/lib/db-check.ts type     — Print detected DB type
 */
import { detectDbType } from './env-schema';

const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
const dbType = process.env.DATABASE_TYPE ?? detectDbType(DATABASE_URL);
const command = process.argv[2];

async function main() {
  switch (command) {
    case 'type':
      console.log(`Database type: ${dbType}`);
      console.log(`Database URL: ${DATABASE_URL}`);
      break;

    case 'push':
      if (dbType === 'mongodb') {
        console.log('[MongoDB] Schemaless — no push needed.');
        console.log('[MongoDB] Run "npm run db:seed:mongo" to seed data.');
      } else {
        console.log(`[Prisma/${dbType}] Running prisma db push...`);
        const { execa } = await import('execa');
        await execa('prisma', ['db', 'push'], { stdio: 'inherit' });
      }
      break;

    case 'migrate':
      if (dbType === 'mongodb') {
        console.log('[MongoDB] Schemaless — no migrations needed.');
      } else {
        console.log(`[Prisma/${dbType}] Running prisma migrate dev...`);
        const { execa } = await import('execa');
        await execa('prisma', ['migrate', 'dev'], { stdio: 'inherit' });
      }
      break;

    case 'reset':
      if (dbType === 'mongodb') {
        console.log('[MongoDB] Dropping all collections...');
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(DATABASE_URL);
        try {
          await client.connect();
          const db = client.db();
          const collections = await db.listCollections().toArray();
          for (const col of collections) {
            await db.collection(col.name).drop();
            console.log(`  Dropped: ${col.name}`);
          }
          console.log('[MongoDB] All collections dropped. Run "npm run db:seed:mongo" to reseed.');
        } finally {
          await client.close();
        }
      } else {
        console.log(`[Prisma/${dbType}] Running prisma migrate reset...`);
        const { execa } = await import('execa');
        await execa('prisma', ['migrate', 'reset', '--skip-seed'], { stdio: 'inherit' });
        console.log(`[Prisma/${dbType}] Running seed...`);
        await execa('tsx', ['prisma/seed.ts'], { stdio: 'inherit' });
      }
      break;

    default:
      console.log('Usage: tsx src/lib/db-check.ts <push|migrate|reset|type>');
      console.log(`\nDetected: ${dbType} (${DATABASE_URL})`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
