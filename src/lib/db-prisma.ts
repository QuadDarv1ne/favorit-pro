import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

globalForPrisma.prisma = db

// Explicitly connect to catch connection errors early
if (process.env.NODE_ENV !== 'production') {
  db.$connect().catch((err) => {
    console.error('[Prisma] Failed to connect:', err)
  })
}
