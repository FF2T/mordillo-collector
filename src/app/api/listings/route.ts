import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const source = params.get('source') || '';
  const matched = params.get('matched');
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '20');

  const where: Record<string, unknown> = { isActive: true };
  if (source) where.source = source;
  if (matched === 'true') where.puzzleId = { not: null };
  if (matched === 'false') where.puzzleId = null;

  const [listings, total] = await Promise.all([
    prisma.marketListing.findMany({
      where,
      include: { puzzle: { select: { id: true, name: true, estimatedPrice: true } } },
      orderBy: { detectedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.marketListing.count({ where }),
  ]);

  const result = listings.map((l: any) => {
    let dealScore: number | null = null;
    if (l.price && l.puzzle?.estimatedPrice) {
      const ratio = l.price / l.puzzle.estimatedPrice;
      dealScore = Math.max(1, Math.min(10, Math.round((1 - ratio) * 10 + 5)));
    }
    return { ...l, dealScore };
  });

  return NextResponse.json({ listings: result, total, page, totalPages: Math.ceil(total / limit) });
}
