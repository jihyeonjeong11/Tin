import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const connectionLimit = process.env.NODE_ENV === 'production' ? 10 : 5

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL?.includes('?')
          ? `${process.env.DATABASE_URL}&connection_limit=${connectionLimit}`
          : `${process.env.DATABASE_URL}?connection_limit=${connectionLimit}`,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
