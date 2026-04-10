import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };

// Lazy initialization to ensure env vars are available at runtime
function createPrismaClient() {
  // Read env vars at call time (not module load time)
  const envObj = process.env;
  const url = envObj.TURSO_DATABASE_URL || envObj.DATABASE_URL;
  const authToken = envObj.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('Database URL not configured');
  }

  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSql(libsql as any);
  return new PrismaClient({ adapter } as any);
}

// Use getter to defer initialization
function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Export as a proxy that lazily initializes
export const prisma = new Proxy({} as InstanceType<typeof PrismaClient>, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});

export default prisma;
