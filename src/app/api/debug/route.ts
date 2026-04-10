import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Import dynamically at runtime
    const { PrismaClient } = await import('@/generated/prisma/client');
    const { PrismaLibSql } = await import('@prisma/adapter-libsql');
    const { createClient } = await import('@libsql/client');

    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      return NextResponse.json({
        error: 'No URL',
        turso: process.env.TURSO_DATABASE_URL?.substring(0, 10),
        db: process.env.DATABASE_URL?.substring(0, 10),
      });
    }

    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSql(libsql as any);
    const prisma = new PrismaClient({ adapter } as any);

    const count = await prisma.puzzle.count();
    return NextResponse.json({ count, ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
