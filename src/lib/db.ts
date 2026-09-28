import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const runtimeDatabaseUrl = process.env.DATABASE_URL
  ? `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes('?') ? '&' : '?'}connection_limit=1`
  : undefined

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: runtimeDatabaseUrl ? { db: { url: runtimeDatabaseUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
