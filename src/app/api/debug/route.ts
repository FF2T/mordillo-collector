import { NextResponse } from 'next/server';

export async function GET() {
  const envKeys = Object.keys(process.env).filter(
    (k) => k.includes('TURSO') || k.includes('DATABASE') || k.includes('VERCEL')
  );

  return NextResponse.json({
    hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
    tursoUrlStart: process.env.TURSO_DATABASE_URL?.substring(0, 20),
    hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
    hasDbUrl: !!process.env.DATABASE_URL,
    relevantEnvKeys: envKeys,
    nodeEnv: process.env.NODE_ENV,
  });
}
