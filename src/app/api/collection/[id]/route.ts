import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

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
