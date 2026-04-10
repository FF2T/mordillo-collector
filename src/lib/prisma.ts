import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';

let _prisma: InstanceType<typeof PrismaClient> | null = null;

export function db(): InstanceType<typeof PrismaClient> {
  if (_prisma) return _prisma;

  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('No database URL configured');
  }

  const libsql = createClient({ url, authToken: authToken || '' });
  const adapter = new PrismaLibSql(libsql as any);
  _prisma = new PrismaClient({ adapter } as any);
  return _prisma;
}

export default db;
