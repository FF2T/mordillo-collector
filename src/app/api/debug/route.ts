import { NextResponse } from 'next/server';
import _db from '@/lib/prisma';

export async function GET() {
  try {
    // Hardcode for test
    const prisma = _db(
      'libsql://mordillo-collector-ff2t.aws-eu-west-1.turso.io',
      'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzU4MTE4ODEsImlkIjoiMDE5ZDc2YTItZDMwMS03YzNhLThjZjAtYTZlMjNkZmEwMWFkIiwicmlkIjoiZGZhMjI3NjctMjFjOC00MWQ0LWJkMmMtMGVmZmRmYTYyNmRlIn0.afc2PCk0ViO5LLw2n2c5KthEgvsgBCqVKD_A7F_81uqr087FxcTsqFmjPRGPF0crHNPGVfh5eFT0V7avCiTJBg'
    );
    const count = await prisma.puzzle.count();
    return NextResponse.json({ count, ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
