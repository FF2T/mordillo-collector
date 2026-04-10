import * as PrismaModule from '../src/generated/prisma/client.ts';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const PrismaClient = (PrismaModule as any).PrismaClient || (PrismaModule as any).default?.PrismaClient;
const libsql = createClient({ url: 'file:prisma/dev.db' });
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

const puzzles = [
  { name: "The Match", publisher: "Heye", year: 2004, reference: "29091", rarity: "uncommon", estimatedPrice: 35, dimensions: "50 x 70 cm", description: "Célèbre scène de match de football humoristique" },
  { name: "Crazy Football", publisher: "Heye", year: 2010, reference: "29284", rarity: "common", estimatedPrice: 25, dimensions: "50 x 70 cm", description: "Le football vu par Mordillo dans un stade délirant" },
  { name: "The Kiss", publisher: "Heye", year: 1999, reference: "28470", rarity: "rare", estimatedPrice: 65, dimensions: "50 x 70 cm", description: "Scène romantique iconique de Mordillo" },
  { name: "Crazy Parade", publisher: "Heye", year: 2012, reference: "29556", rarity: "common", estimatedPrice: 22, dimensions: "50 x 70 cm", description: "Parade colorée de personnages typiques" },
  { name: "The Jungle", publisher: "Heye", year: 2008, reference: "29168", rarity: "uncommon", estimatedPrice: 40, dimensions: "50 x 70 cm", description: "Aventure dans la jungle tropicale" },
  { name: "Balcony", publisher: "Heye", year: 2001, reference: "28800", rarity: "rare", estimatedPrice: 70, dimensions: "50 x 70 cm", description: "Scène de balcon avec personnages empilés" },
  { name: "Goal!", publisher: "Heye", year: 2014, reference: "29691", rarity: "common", estimatedPrice: 20, dimensions: "50 x 70 cm", description: "But spectaculaire dans un match endiablé" },
  { name: "Lovers", publisher: "Heye", year: 2003, reference: "28987", rarity: "uncommon", estimatedPrice: 45, dimensions: "50 x 70 cm", description: "Couple d'amoureux dans un monde coloré" },
  { name: "The City", publisher: "Heye", year: 2015, reference: "29749", rarity: "common", estimatedPrice: 22, dimensions: "50 x 70 cm", description: "Ville fourmillante de détails humoristiques" },
  { name: "Mordillo United", publisher: "Heye", year: 2018, reference: "29907", rarity: "common", estimatedPrice: 20, dimensions: "50 x 70 cm", description: "Équipe de football complètement folle" },
  { name: "The Conquest", publisher: "Heye", year: 1997, reference: "28290", rarity: "very_rare", estimatedPrice: 95, dimensions: "50 x 70 cm", description: "Scène de conquête médiévale humoristique" },
  { name: "Cartoon Classics", publisher: "Heye", year: 2016, reference: "29803", rarity: "common", estimatedPrice: 18, dimensions: "50 x 70 cm", description: "Compilation de scènes classiques de Mordillo" },
  { name: "The Bottle", publisher: "Heye", year: 2006, reference: "29130", rarity: "uncommon", estimatedPrice: 38, dimensions: "50 x 70 cm", description: "Message dans une bouteille version Mordillo" },
  { name: "Mordillo Sinfonie", publisher: "Heye", year: 2005, reference: "29105", rarity: "rare", estimatedPrice: 55, dimensions: "50 x 70 cm", description: "Orchestre symphonique déjanté" },
  { name: "Beach Life", publisher: "Heye", year: 2019, reference: "29944", rarity: "common", estimatedPrice: 18, dimensions: "50 x 70 cm", description: "Vie de plage humoristique" },
  { name: "Mordillo Show", publisher: "Heye", year: 2007, reference: "29152", rarity: "uncommon", estimatedPrice: 42, dimensions: "50 x 70 cm", description: "Grand spectacle avec tous les personnages" },
  { name: "The Office", publisher: "Heye", year: 2011, reference: "29429", rarity: "common", estimatedPrice: 25, dimensions: "50 x 70 cm", description: "Bureau chaotique typique de Mordillo" },
  { name: "Crazy Circus", publisher: "Heye", year: 2009, reference: "29210", rarity: "uncommon", estimatedPrice: 35, dimensions: "50 x 70 cm", description: "Cirque avec des numéros impossibles" },
  { name: "The Garden", publisher: "Heye", year: 2013, reference: "29611", rarity: "common", estimatedPrice: 20, dimensions: "50 x 70 cm", description: "Jardin merveilleux peuplé de créatures" },
  { name: "Traffic", publisher: "Heye", year: 2002, reference: "28880", rarity: "uncommon", estimatedPrice: 40, dimensions: "50 x 70 cm", description: "Embouteillage monstrueux version Mordillo" },
  { name: "Love", publisher: "Clementoni", year: 2017, reference: "39217", rarity: "common", estimatedPrice: 15, dimensions: "50 x 69 cm", description: "Thème de l'amour chez Mordillo - édition Clementoni" },
  { name: "The Surrender", publisher: "Heye", year: 1995, reference: "28120", rarity: "very_rare", estimatedPrice: 110, dimensions: "50 x 70 cm", description: "Scène de reddition comique rare" },
  { name: "Mordillo Puzzler", publisher: "Clementoni", year: 2020, reference: "39480", rarity: "common", estimatedPrice: 15, dimensions: "50 x 69 cm", description: "Compilation moderne chez Clementoni" },
  { name: "The Tower", publisher: "Heye", year: 2000, reference: "28710", rarity: "rare", estimatedPrice: 60, dimensions: "50 x 70 cm", description: "Tour humaine vertigineuse" },
  { name: "Animal World", publisher: "Heye", year: 2021, reference: "29980", rarity: "common", estimatedPrice: 18, dimensions: "50 x 70 cm", description: "Monde animal façon Mordillo" },
  { name: "The Stage", publisher: "Heye", year: 1993, reference: "27980", rarity: "ultra_rare", estimatedPrice: 150, dimensions: "50 x 70 cm", description: "Scène de théâtre - première édition très recherchée" },
  { name: "Crazy Soccer", publisher: "Heye", year: 2022, reference: "30001", rarity: "common", estimatedPrice: 18, dimensions: "50 x 70 cm", description: "Nouvelle version du thème football" },
  { name: "Mordillo Together", publisher: "Clementoni", year: 2019, reference: "39450", rarity: "common", estimatedPrice: 14, dimensions: "50 x 69 cm", description: "Personnages rassemblés - Clementoni" },
  { name: "The Reef", publisher: "Heye", year: 2017, reference: "29868", rarity: "uncommon", estimatedPrice: 30, dimensions: "50 x 70 cm", description: "Récif corallien plein de surprises" },
  { name: "Crazy Zoo", publisher: "Heye", year: 1990, reference: "27450", rarity: "very_rare", estimatedPrice: 120, dimensions: "50 x 70 cm", description: "Zoo délirant - édition ancienne très prisée" },
];

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'jhoussiere@yahoo.fr' },
    update: {},
    create: { email: 'jhoussiere@yahoo.fr', name: 'Sébastien', passwordHash },
  });
  console.log(`User created: ${user.email}`);

  for (const p of puzzles) {
    await prisma.puzzle.create({
      data: { ...p, edition: 'Standard', isVerified: true },
    });
  }
  console.log(`${puzzles.length} puzzles created`);

  const allPuzzles = await prisma.puzzle.findMany();
  const ownedIndices = [0, 2, 4, 6, 8, 10, 14, 18, 20, 24];
  const conditions = ['new', 'complete', 'complete', 'used', 'complete', 'new', 'complete', 'complete', 'new', 'complete'];
  const prices = [30, 55, 35, 15, 20, 80, 16, 18, 12, 15];

  for (let i = 0; i < ownedIndices.length; i++) {
    const puzzle = allPuzzles[ownedIndices[i]];
    if (!puzzle) continue;
    await prisma.collectionItem.create({
      data: {
        puzzleId: puzzle.id, userId: user.id, condition: conditions[i],
        boxCondition: i % 2 === 0 ? 'Très bon état' : 'Usure normale',
        purchasePrice: prices[i],
        purchaseDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        notes: i === 0 ? 'Trouvé sur eBay, très bon état' : null,
      },
    });
  }
  console.log(`${ownedIndices.length} collection items created`);

  await prisma.alert.createMany({
    data: [
      { userId: user.id, puzzleId: allPuzzles[3]?.id, type: 'missing_puzzle', message: `"${allPuzzles[3]?.name}" a été repéré sur eBay à 19€ !` },
      { userId: user.id, puzzleId: allPuzzles[25]?.id, type: 'rare_listing', message: `Puzzle ultra-rare "${allPuzzles[25]?.name}" listé sur Vinted !` },
      { userId: user.id, puzzleId: allPuzzles[7]?.id, type: 'good_deal', message: `"${allPuzzles[7]?.name}" disponible à 20€ (estimé 45€) - Score 8/10` },
    ],
  });
  console.log('Sample alerts created');

  await prisma.marketListing.createMany({
    data: [
      { puzzleId: allPuzzles[3]?.id, source: 'ebay', title: 'Puzzle Mordillo Crazy Parade 1000 pièces Heye NEUF', price: 19, condition: 'Neuf', hasOriginalBox: true, isComplete: true, listingUrl: 'https://www.ebay.fr/itm/example1' },
      { puzzleId: allPuzzles[25]?.id, source: 'vinted', title: 'Rare puzzle Mordillo The Stage 1000p Heye 1993', price: 120, condition: 'Occasion', hasOriginalBox: true, isComplete: true, listingUrl: 'https://www.vinted.fr/items/example2' },
      { puzzleId: allPuzzles[7]?.id, source: 'leboncoin', title: 'Puzzle Mordillo Lovers 1000 pcs complet', price: 20, condition: 'Bon état', hasOriginalBox: false, isComplete: true, listingUrl: 'https://www.leboncoin.fr/jeux_jouets/example3' },
      { source: 'ebay', title: 'Puzzle Mordillo 1000 pièces vintage lot', price: 45, listingUrl: 'https://www.ebay.fr/itm/example4' },
      { puzzleId: allPuzzles[11]?.id, source: 'vinted', title: 'Heye Mordillo Cartoon Classics puzzle 1000', price: 12, condition: 'Bon état', hasOriginalBox: true, isComplete: true, listingUrl: 'https://www.vinted.fr/items/example5' },
    ],
  });
  console.log('Sample market listings created');
  console.log('Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
