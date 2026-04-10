import { NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET() {
  try {
    const prisma = db();
    const count = await prisma.puzzle.count();
    return NextResponse.json({ count, ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
