import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use configured DATABASE_URL from .env with a healthy connection pool
const rawUrl = process.env.DATABASE_URL;
let runtimeDatabaseUrl = rawUrl;

// If DATABASE_URL does not already specify connection limits, provide balanced pool settings
if (rawUrl && !rawUrl.includes('connection_limit=')) {
  const separator = rawUrl.includes('?') ? '&' : '?';
  runtimeDatabaseUrl = `${rawUrl}${separator}connection_limit=15&pool_timeout=30`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: runtimeDatabaseUrl ? { db: { url: runtimeDatabaseUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
