import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// In Vercel Serverless Functions, process.cwd() is /var/task.
// Ensure the SQLite database file path is resolved absolutely so Prisma never fails to open dev.db.
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
process.env.DATABASE_URL = `file:${dbPath}`

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
