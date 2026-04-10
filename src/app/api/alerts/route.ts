import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET() {
  const alerts = await db().alert.findMany({
    where: { userId: 1 },
    include: {
      puzzle: { select: { id: true, name: true, image: true } },
      listing: { select: { id: true, title: true, price: true, listingUrl: true, source: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(alerts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (body.markAllRead) {
    await db().alert.updateMany({
      where: { userId: 1, isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  }

  if (body.id) {
    await db().alert.update({
      where: { id: body.id },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
