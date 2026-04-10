import { PrismaClient } from '@/generated/prisma/client';

let _prisma: InstanceType<typeof PrismaClient> | null = null;

export function db(): InstanceType<typeof PrismaClient> {
  if (_prisma) return _prisma;

  // Import adapter from a .js file that won't be statically analyzed by Turbopack
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createAdapter } = require('./create-prisma.js');
  const adapter = createAdapter();
  _prisma = new PrismaClient({ adapter } as any);
  return _prisma;
}

export default db;
