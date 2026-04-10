import { PrismaClient } from '@/generated/prisma/client';

let _prisma: InstanceType<typeof PrismaClient> | null = null;

export function getPrisma(): InstanceType<typeof PrismaClient> {
  if (_prisma) return _prisma;

  // Dynamic require to avoid Turbopack inlining
  const { PrismaLibSql } = require('@prisma/adapter-libsql');
  const { createClient } = require('@libsql/client');

  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('Database URL not configured');
  }

  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSql(libsql);
  _prisma = new PrismaClient({ adapter } as any);
  return _prisma;
}

// For backward compatibility - lazy proxy
const prisma = new Proxy({} as InstanceType<typeof PrismaClient>, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});

export default prisma;
