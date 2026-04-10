import { NextRequest, NextResponse } from 'next/server';
import _db from '@/lib/prisma';
const db = () => _db(process.env.TURSO_DATABASE_URL, process.env.TURSO_AUTH_TOKEN);

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { result.push(current.trim()); current = ''; }
      else current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    return NextResponse.json({ error: 'CSV must have header + data rows' }, { status: 400 });
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const nameIdx = headers.findIndex((h) => h.includes('nom') || h.includes('name'));
  const pubIdx = headers.findIndex((h) => h.includes('éditeur') || h.includes('publisher'));
  const yearIdx = headers.findIndex((h) => h.includes('année') || h.includes('year'));
  const refIdx = headers.findIndex((h) => h.includes('référence') || h.includes('reference') || h.includes('sku'));
  const rarityIdx = headers.findIndex((h) => h.includes('rareté') || h.includes('rarity'));
  const priceIdx = headers.findIndex((h) => h.includes('prix estimé') || h.includes('estimated'));

  if (nameIdx === -1) {
    return NextResponse.json({ error: 'CSV must have a name/nom column' }, { status: 400 });
  }

  let created = 0;
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const name = vals[nameIdx];
    if (!name) continue;

    const existing = await db().puzzle.findFirst({ where: { name } });
    if (existing) { skipped++; continue; }

    await db().puzzle.create({
      data: {
        name,
        publisher: pubIdx >= 0 ? vals[pubIdx] || 'Unknown' : 'Unknown',
        year: yearIdx >= 0 && vals[yearIdx] ? parseInt(vals[yearIdx]) || null : null,
        reference: refIdx >= 0 ? vals[refIdx] || null : null,
        rarity: rarityIdx >= 0 ? vals[rarityIdx] || 'common' : 'common',
        estimatedPrice: priceIdx >= 0 && vals[priceIdx] ? parseFloat(vals[priceIdx]) || null : null,
      },
    });
    created++;
  }

  return NextResponse.json({ message: `Import: ${created} créés, ${skipped} ignorés (doublons)`, created, skipped });
}
