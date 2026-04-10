import { NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET() {
  // Log env BEFORE calling db()
  const envInfo = {
    hasTurso: typeof process.env.TURSO_DATABASE_URL,
    tursoVal: process.env.TURSO_DATABASE_URL?.substring(0, 20) || 'UNDEFINED',
    hasToken: typeof process.env.TURSO_AUTH_TOKEN,
    dbUrl: process.env.DATABASE_URL?.substring(0, 20) || 'UNDEFINED',
  };

  try {
    const prisma = db();
    const count = await prisma.puzzle.count();
    return NextResponse.json({ count, ok: true, env: envInfo });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, env: envInfo }, { status: 500 });
  }
}
