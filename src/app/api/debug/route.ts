import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = 'libsql://mordillo-collector-ff2t.aws-eu-west-1.turso.io';
    const authToken = process.env.TURSO_AUTH_TOKEN || '';

    // Try direct libsql connection first
    const { createClient } = await import('@libsql/client');
    const libsql = createClient({ url, authToken });

    // Test raw query
    const result = await libsql.execute('SELECT count(*) as cnt FROM Puzzle');
    const rawCount = result.rows[0]?.cnt;

    // Now try Prisma
    const { PrismaLibSql } = await import('@prisma/adapter-libsql');
    const { PrismaClient } = await import('@/generated/prisma/client');

    const adapter = new PrismaLibSql(libsql as any);
    const prisma = new PrismaClient({ adapter } as any);
    const prismaCount = await prisma.puzzle.count();

    return NextResponse.json({ rawCount, prismaCount, ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, code: e.code }, { status: 500 });
  }
}
