import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const puzzle = await prisma.puzzle.update({
    where: { id: parseInt(id) },
    data: {
      flagged: true,
      flagNote: body.note || 'Données incertaines ou incomplètes',
    },
  });
  return NextResponse.json(puzzle);
}
