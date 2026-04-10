import { NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET() {
  const prisma = db();
  const [totalPuzzles, ownedItems, allPuzzles] = await Promise.all([
    prisma.puzzle.count(),
    db().collectionItem.findMany({
      where: { userId: 1 },
      include: { puzzle: true },
    }),
    db().puzzle.findMany({
      select: { id: true, rarity: true, estimatedPrice: true },
    }),
  ]);

  const ownedIds = new Set(ownedItems.map((i: any) => i.puzzleId));
  const ownedCount = ownedIds.size;
  const completionPercentage = totalPuzzles > 0 ? Math.round((ownedCount / totalPuzzles) * 100) : 0;

  const totalValue = ownedItems.reduce((sum: number, item: any) => {
    const price = item.purchasePrice || item.puzzle.estimatedPrice || 0;
    return sum + price;
  }, 0);

  const estimatedTotalValue = ownedItems.reduce((sum: number, item: any) => {
    return sum + (item.puzzle.estimatedPrice || 0);
  }, 0);

  const missingCount = totalPuzzles - ownedCount;

  const rarePuzzlesOwned = ownedItems.filter((i: any) =>
    ['rare', 'very_rare', 'ultra_rare'].includes(i.puzzle.rarity)
  ).length;

  const rarityCounts: Record<string, number> = {
    common: 0, uncommon: 0, rare: 0, very_rare: 0, ultra_rare: 0,
  };
  allPuzzles.forEach((p: any) => {
    if (p.rarity in rarityCounts) {
      rarityCounts[p.rarity]++;
    }
  });

  return NextResponse.json({
    totalPuzzles,
    ownedCount,
    completionPercentage,
    totalValue: Math.round(totalValue),
    estimatedTotalValue: Math.round(estimatedTotalValue),
    missingCount,
    rarePuzzlesOwned,
    rarityCounts,
  });
}
