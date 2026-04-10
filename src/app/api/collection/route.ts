import { NextRequest, NextResponse } from 'next/server';
import _db from '@/lib/prisma';
const db = () => _db(process.env.TURSO_DATABASE_URL, process.env.TURSO_AUTH_TOKEN);

export async function GET() {
  const items = await db().collectionItem.findMany({
    where: { userId: 1 },
    include: { puzzle: true },
    orderBy: { puzzle: { name: 'asc' } },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const item = await db().collectionItem.create({
    data: {
      puzzleId: body.puzzleId,
      userId: 1,
      condition: body.condition || 'complete',
      boxCondition: body.boxCondition || null,
      purchasePrice: body.purchasePrice ? parseFloat(body.purchasePrice) : null,
      purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
      notes: body.notes || null,
    },
    include: { puzzle: true },
  });
  return NextResponse.json(item, { status: 201 });
}
