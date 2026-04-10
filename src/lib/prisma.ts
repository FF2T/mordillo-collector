let _prisma: any = null;

export function db(): any {
  if (_prisma) return _prisma;

  // Use eval to completely prevent Turbopack from analyzing these requires
  const _require = eval('require');
  const { PrismaClient } = _require('@prisma/client');
  const { PrismaLibSql } = _require('@prisma/adapter-libsql');
  const { createClient } = _require('@libsql/client');

  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('No database URL configured');
  }

  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSql(libsql);
  _prisma = new PrismaClient({ adapter });
  return _prisma;
}

export default db;
