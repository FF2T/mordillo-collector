import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';

let _prisma: PrismaClient | null = null;

export function db(url?: string, authToken?: string): PrismaClient {
  if (_prisma) return _prisma;

  const dbUrl = url || process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const token = authToken || process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    throw new Error('No database URL configured');
  }

  // For local SQLite files, don't use the adapter
  if (dbUrl.startsWith('file:')) {
    _prisma = new PrismaClient();
    return _prisma;
  }

  // For Turso/libsql URLs, use the adapter
  const libsql = createClient({ url: dbUrl, authToken: token });
  const adapter = new PrismaLibSQL(libsql as any);
  _prisma = new PrismaClient({ adapter } as any);
  return _prisma;
}

export default db;
