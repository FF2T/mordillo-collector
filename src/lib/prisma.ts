let _prisma: any = null;

export function db(url?: string, authToken?: string): any {
  if (_prisma) return _prisma;

  const dbUrl = url;
  if (!dbUrl) {
    throw new Error('Database URL must be passed to db()');
  }

  // Dynamic import at runtime - avoids Turbopack static analysis
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@libsql/client/web') as typeof import('@libsql/client/web');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require('@prisma/adapter-libsql') as typeof import('@prisma/adapter-libsql');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@/generated/prisma/client') as typeof import('@/generated/prisma/client');

  const libsql = createClient({ url: dbUrl, authToken: authToken || '' });
  const adapter = new (PrismaLibSql as any)(libsql);
  _prisma = new PrismaClient({ adapter } as any);
  return _prisma;
}

export default db;
