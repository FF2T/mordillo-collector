import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };

function getEnv(key: string): string | undefined {
  // Avoid Turbopack inlining by using dynamic access
  return (process as any)['env'][key];
}

function createPrismaClient() {
  const url = getEnv('TURSO_DATABASE_URL') || getEnv('DATABASE_URL');
  const authToken = getEnv('TURSO_AUTH_TOKEN');

  if (!url) {
    throw new Error(
      `Database URL not set. TURSO_DATABASE_URL=${getEnv('TURSO_DATABASE_URL')}, DATABASE_URL=${getEnv('DATABASE_URL')}`
    );
  }

  const libsql = createClient({
    url,
    authToken,
  });

  const adapter = new PrismaLibSql(libsql as any);
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (getEnv('NODE_ENV') !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
