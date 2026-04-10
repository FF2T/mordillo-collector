import { NextRequest, NextResponse } from 'next/server';
import _db from '@/lib/prisma';
const db = () => _db(process.env.TURSO_DATABASE_URL, process.env.TURSO_AUTH_TOKEN);

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = params.get('search') || '';
  const publisher = params.get('publisher') || '';
  const year = params.get('year') || '';
  const rarity = params.get('rarity') || '';
  const owned = params.get('owned');
  const sort = params.get('sort') || 'name';
  const order = params.get('order') || 'asc';
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '50');

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { reference: { contains: search } },
      { publisher: { contains: search } },
    ];
  }
  if (publisher) where.publisher = publisher;
  if (year) where.year = parseInt(year);
  if (rarity) where.rarity = rarity;

  if (owned === 'true') {
    where.collectionItems = { some: { userId: 1 } };
  } else if (owned === 'false') {
    where.collectionItems = { none: { userId: 1 } };
  }

  const orderBy: Record<string, string> = {};
  if (['name', 'year', 'rarity', 'estimatedPrice', 'publisher', 'createdAt'].includes(sort)) {
    orderBy[sort] = order === 'desc' ? 'desc' : 'asc';
  } else {
    orderBy.name = 'asc';
  }

  const [puzzles, total] = await Promise.all([
    db().puzzle.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        collectionItems: { where: { userId: 1 }, take: 1 },
      },
    }),
    db().puzzle.count({ where }),
  ]);

  const result = puzzles.map((p) => ({
    ...p,
    owned: p.collectionItems.length > 0,
    collectionItems: undefined,
  }));

  return NextResponse.json({
    puzzles: result,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const puzzle = await db().puzzle.create({
    data: {
      name: body.name,
      image: body.image || null,
      publisher: body.publisher || 'Heye',
      year: body.year ? parseInt(body.year) : null,
      reference: body.reference || null,
      dimensions: body.dimensions || null,
      edition: body.edition || 'Standard',
      rarity: body.rarity || 'common',
      estimatedPrice: body.estimatedPrice ? parseFloat(body.estimatedPrice) : null,
      description: body.description || null,
    },
  });
  return NextResponse.json(puzzle, { status: 201 });
}
