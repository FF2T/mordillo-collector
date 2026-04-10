import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = 'libsql://mordillo-collector-ff2t.aws-eu-west-1.turso.io';
    const authToken = process.env.TURSO_AUTH_TOKEN || '';

    const { createClient } = await import('@libsql/client');
    const libsql = createClient({ url, authToken });

    // Test raw query first
    const raw = await libsql.execute('SELECT count(*) as cnt FROM Puzzle');

    const { PrismaLibSql } = await import('@prisma/adapter-libsql');
    const { PrismaClient } = await import('@/generated/prisma/client');

    const adapter = new PrismaLibSql(libsql as any);
    const prisma = new PrismaClient({ adapter } as any);

    const count = await prisma.puzzle.count();
    return NextResponse.json({ rawCount: raw.rows[0]?.cnt, prismaCount: count, ok: true });
  } catch (e: any) {
    return NextResponse.json({
      error: e.message?.substring(0, 200),
      code: e.code,
      name: e.name,
    }, { status: 500 });
  }
}
