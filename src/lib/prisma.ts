import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import { getTursoUrl, getTursoToken } from './env';

let _prisma: InstanceType<typeof PrismaClient> | null = null;

export function db(): InstanceType<typeof PrismaClient> {
  if (_prisma) return _prisma;

  const url = getTursoUrl();
  const authToken = getTursoToken();

  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSql(libsql as any);
  _prisma = new PrismaClient({ adapter } as any);
  return _prisma;
}

export default db;
