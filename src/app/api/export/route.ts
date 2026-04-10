import { NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET() {
  const items = await db().collectionItem.findMany({
    where: { userId: 1 },
    include: { puzzle: true },
    orderBy: { puzzle: { name: 'asc' } },
  });

  const headers = [
    'Nom du puzzle',
    'Éditeur',
    'Année',
    'Référence',
    'Dimensions',
    'Édition',
    'Rareté',
    'Prix estimé',
    'État',
    'État boîte',
    'Prix d\'achat',
    'Date d\'achat',
    'Notes',
  ];

  const escape = (v: string | number | null | undefined): string => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const rows = items.map((item: any) => [
    escape(item.puzzle.name),
    escape(item.puzzle.publisher),
    escape(item.puzzle.year),
    escape(item.puzzle.reference),
    escape(item.puzzle.dimensions),
    escape(item.puzzle.edition),
    escape(item.puzzle.rarity),
    escape(item.puzzle.estimatedPrice),
    escape(item.condition),
    escape(item.boxCondition),
    escape(item.purchasePrice),
    escape(item.purchaseDate ? item.purchaseDate.toISOString().split('T')[0] : null),
    escape(item.notes),
  ]);

  const csv = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mordillo-collection.csv"',
    },
  });
}
