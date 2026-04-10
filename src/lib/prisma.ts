import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };

function createPrismaClient() {
  const url = process.env['TURSO_DATABASE_URL'] || process.env['DATABASE_URL'];
  const authToken = process.env['TURSO_AUTH_TOKEN'];

  if (!url) {
    console.error('ENV DUMP:', JSON.stringify(Object.keys(process.env).filter(k => k.includes('TURSO') || k.includes('DATABASE'))));
    throw new Error('Database URL not set');
  }

  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSql(libsql as any);
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
