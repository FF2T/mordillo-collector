import { NextResponse } from 'next/server';
import _db from '@/lib/prisma';
const db = () => _db(process.env.TURSO_DATABASE_URL, process.env.TURSO_AUTH_TOKEN);

export async function GET() {
  try {
    const prisma = db();
    const count = await prisma.puzzle.count();
    return NextResponse.json({ count, ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message?.substring(0, 300), code: e.code }, { status: 500 });
  }
}
