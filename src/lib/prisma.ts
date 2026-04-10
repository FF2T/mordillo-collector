let _prisma: any = null;

export function db(url?: string, authToken?: string): any {
  if (_prisma) return _prisma;

  const dbUrl = url;
  if (!dbUrl) {
    throw new Error('Database URL must be passed to db()');
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const libsqlModule = require('@libsql/client');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const adapterModule = require('@prisma/adapter-libsql');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const prismaModule = require('@/generated/prisma/client');

  const createClient = libsqlModule.createClient || libsqlModule.default?.createClient;
  const PrismaLibSql = adapterModule.PrismaLibSql || adapterModule.default?.PrismaLibSql;
  const PrismaClient = prismaModule.PrismaClient || prismaModule.default?.PrismaClient;

  const libsql = createClient({ url: dbUrl, authToken: authToken || undefined });
  const adapter = new PrismaLibSql(libsql);
  _prisma = new PrismaClient({ adapter });
  return _prisma;
}

export default db;
