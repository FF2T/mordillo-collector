import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const puzzle = await prisma.puzzle.findUnique({
    where: { id: parseInt(id) },
    include: {
      collectionItems: { where: { userId: 1 }, take: 1 },
      priceHistory: { orderBy: { recordedAt: 'desc' }, take: 20 },
      marketListings: { where: { isActive: true }, orderBy: { detectedAt: 'desc' }, take: 10 },
    },
  });

  if (!puzzle) {
    return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });
  }

  const prices = puzzle.priceHistory.map((p) => p.price);
  const priceStats = prices.length > 0
    ? {
        avg: prices.reduce((a, b) => a + b, 0) / prices.length,
        min: Math.min(...prices),
        max: Math.max(...prices),
      }
    : null;

  let dealScore = null;
  if (puzzle.estimatedPrice && puzzle.marketListings.length > 0) {
    const cheapest = Math.min(
      ...puzzle.marketListings.filter((l) => l.price).map((l) => l.price!)
    );
    const ratio = cheapest / puzzle.estimatedPrice;
    dealScore = Math.max(1, Math.min(10, Math.round((1 - ratio) * 10 + 5)));
  }

  return NextResponse.json({
    ...puzzle,
    owned: puzzle.collectionItems.length > 0,
    collectionItem: puzzle.collectionItems[0] || null,
    priceStats,
    dealScore,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const puzzle = await prisma.puzzle.update({
    where: { id: parseInt(id) },
    data: {
      name: body.name,
      image: body.image,
      publisher: body.publisher,
      year: body.year ? parseInt(body.year) : null,
      reference: body.reference,
      dimensions: body.dimensions,
      edition: body.edition,
      rarity: body.rarity,
      estimatedPrice: body.estimatedPrice ? parseFloat(body.estimatedPrice) : null,
      description: body.description,
      isVerified: body.isVerified,
    },
  });
  return NextResponse.json(puzzle);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.puzzle.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
