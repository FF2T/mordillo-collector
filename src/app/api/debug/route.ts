import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

export async function GET() {
  try {
    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      return NextResponse.json({ error: 'No URL', envKeys: Object.keys(process.env).filter(k => k.includes('TURSO') || k.includes('DATABASE')) });
    }

    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSql(libsql as any);
    const prisma = new PrismaClient({ adapter } as any);

    const count = await prisma.puzzle.count();
    return NextResponse.json({ count, url: url.substring(0, 25) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.substring(0, 200) }, { status: 500 });
  }
}
