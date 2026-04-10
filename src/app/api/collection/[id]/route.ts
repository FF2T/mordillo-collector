import { NextRequest, NextResponse } from 'next/server';
import _db from '@/lib/prisma';
const db = () => _db(process.env.TURSO_DATABASE_URL, process.env.TURSO_AUTH_TOKEN);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const item = await db().collectionItem.update({
    where: { id: parseInt(id) },
    data: {
      condition: body.condition,
      boxCondition: body.boxCondition,
      purchasePrice: body.purchasePrice ? parseFloat(body.purchasePrice) : null,
      purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
      notes: body.notes,
    },
    include: { puzzle: true },
  });
  return NextResponse.json(item);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db().collectionItem.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
