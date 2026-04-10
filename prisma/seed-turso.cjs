const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

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
  console.log('Seeding Turso database...');
  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync('admin123', 10);

  // User
  await db.execute({ sql: `INSERT OR IGNORE INTO "User" (email, name, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`, args: ['jhoussiere@yahoo.fr', 'Sébastien', passwordHash, now, now] });
  const userRes = await db.execute({ sql: `SELECT id FROM "User" WHERE email = ?`, args: ['jhoussiere@yahoo.fr'] });
  const userId = userRes.rows[0].id;
  console.log(`User: id=${userId}`);

  // Puzzles
  for (const p of puzzles) {
    await db.execute({
      sql: `INSERT INTO "Puzzle" (name, publisher, year, reference, rarity, estimatedPrice, dimensions, description, edition, isVerified, flagged, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Standard', 1, 0, ?, ?)`,
      args: [p.name, p.publisher, p.year, p.reference, p.rarity, p.estimatedPrice, p.dimensions, p.description, now, now],
    });
  }
  console.log(`${puzzles.length} puzzles created`);

  // Collection
  const allRes = await db.execute(`SELECT id, name FROM "Puzzle" ORDER BY id`);
  const allPuzzles = allRes.rows;
  const ownedIndices = [0, 2, 4, 6, 8, 10, 14, 18, 20, 24];
  const conditions = ['new', 'complete', 'complete', 'used', 'complete', 'new', 'complete', 'complete', 'new', 'complete'];
  const prices = [30, 55, 35, 15, 20, 80, 16, 18, 12, 15];
  const boxConds = ['Très bon état', 'Usure normale'];

  for (let i = 0; i < ownedIndices.length; i++) {
    const puzzle = allPuzzles[ownedIndices[i]];
    if (!puzzle) continue;
    const purchaseDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString();
    await db.execute({
      sql: `INSERT INTO "CollectionItem" (puzzleId, userId, condition, boxCondition, purchasePrice, purchaseDate, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [puzzle.id, userId, conditions[i], boxConds[i % 2], prices[i], purchaseDate, i === 0 ? 'Trouvé sur eBay, très bon état' : null, now, now],
    });
  }
  console.log(`${ownedIndices.length} collection items created`);

  // Alerts
  await db.execute({ sql: `INSERT INTO "Alert" (userId, puzzleId, type, message, isRead, createdAt) VALUES (?, ?, ?, ?, 0, ?)`, args: [userId, allPuzzles[3]?.id, 'missing_puzzle', `"${allPuzzles[3]?.name}" a été repéré sur eBay à 19€ !`, now] });
  await db.execute({ sql: `INSERT INTO "Alert" (userId, puzzleId, type, message, isRead, createdAt) VALUES (?, ?, ?, ?, 0, ?)`, args: [userId, allPuzzles[25]?.id, 'rare_listing', `Puzzle ultra-rare "${allPuzzles[25]?.name}" listé sur Vinted !`, now] });
  await db.execute({ sql: `INSERT INTO "Alert" (userId, puzzleId, type, message, isRead, createdAt) VALUES (?, ?, ?, ?, 0, ?)`, args: [userId, allPuzzles[7]?.id, 'good_deal', `"${allPuzzles[7]?.name}" disponible à 20€ (estimé 45€) - Score 8/10`, now] });
  console.log('Alerts created');

  // Market listings
  await db.execute({ sql: `INSERT INTO "MarketListing" (puzzleId, source, title, price, condition, hasOriginalBox, isComplete, listingUrl, isActive, detectedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`, args: [allPuzzles[3]?.id, 'ebay', 'Puzzle Mordillo Crazy Parade 1000 pièces Heye NEUF', 19, 'Neuf', 1, 1, 'https://www.ebay.fr/itm/example1', now] });
  await db.execute({ sql: `INSERT INTO "MarketListing" (puzzleId, source, title, price, condition, hasOriginalBox, isComplete, listingUrl, isActive, detectedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`, args: [allPuzzles[25]?.id, 'vinted', 'Rare puzzle Mordillo The Stage 1000p Heye 1993', 120, 'Occasion', 1, 1, 'https://www.vinted.fr/items/example2', now] });
  await db.execute({ sql: `INSERT INTO "MarketListing" (puzzleId, source, title, price, condition, hasOriginalBox, isComplete, listingUrl, isActive, detectedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`, args: [allPuzzles[7]?.id, 'leboncoin', 'Puzzle Mordillo Lovers 1000 pcs complet', 20, 'Bon état', 0, 1, 'https://www.leboncoin.fr/jeux_jouets/example3', now] });
  await db.execute({ sql: `INSERT INTO "MarketListing" (puzzleId, source, title, price, condition, hasOriginalBox, isComplete, listingUrl, isActive, detectedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`, args: [null, 'ebay', 'Puzzle Mordillo 1000 pièces vintage lot', 45, null, null, null, 'https://www.ebay.fr/itm/example4', now] });
  await db.execute({ sql: `INSERT INTO "MarketListing" (puzzleId, source, title, price, condition, hasOriginalBox, isComplete, listingUrl, isActive, detectedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`, args: [allPuzzles[11]?.id, 'vinted', 'Heye Mordillo Cartoon Classics puzzle 1000', 12, 'Bon état', 1, 1, 'https://www.vinted.fr/items/example5', now] });
  console.log('Market listings created');

  console.log('Seed complete!');
}

main().catch(e => { console.error(e); process.exit(1); });
