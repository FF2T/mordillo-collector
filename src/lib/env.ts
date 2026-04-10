// Separate file to read env vars - not bundled with Prisma
export function getTursoUrl(): string {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('No database URL configured');
  return url;
}

export function getTursoToken(): string | undefined {
  return process.env.TURSO_AUTH_TOKEN;
}
