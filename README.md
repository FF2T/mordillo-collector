# Mordillo Collector

Application web de suivi et catalogage de puzzles Mordillo 1000 pieces, tous editeurs confondus.

## Fonctionnalites

- **Catalogue complet** : 30 puzzles Mordillo pre-charges (Heye, Clementoni) avec raretes, prix estimes, references
- **Suivi de collection** : Marquer les puzzles possedes, ajouter etat/prix d'achat/notes
- **Dashboard** : Statistiques completes (progression, valeur, puzzles rares)
- **Galerie visuelle** : Grille filtree par editeur, rarete, statut de possession
- **Monitoring marche** : Suivi des annonces eBay, Vinted, Leboncoin
- **Systeme d'alertes** : Notifications pour puzzles manquants, rares, bonnes affaires
- **Score de deal** : Evaluation automatique des prix par rapport au marche
- **Import/Export CSV** : Gestion de collection portable
- **Signalement** : Possibilite de flaguer des donnees incertaines

## Stack technique

- **Frontend** : Next.js 16 + React 19 + Tailwind CSS 4
- **Backend** : Next.js API Routes
- **Base de donnees** : SQLite via Prisma ORM
- **UI** : Design dark premium avec accents ambres/dores

## Installation et lancement

```bash
# Cloner le repo
git clone <url-du-repo>
cd mordillo-collector

# Installer les dependances
npm install

# Generer le client Prisma
npx prisma generate

# Creer la base de donnees + migration
npx prisma migrate dev

# Charger les donnees de demonstration (30 puzzles Mordillo)
npx prisma db seed

# Lancer le serveur de developpement
npm run dev
```

Ouvrir http://localhost:3000 dans le navigateur.

## Deploiement

### Vercel (recommande)

1. Pousser le code sur GitHub
2. Connecter le repo a Vercel
3. Pour la production, migrer vers PostgreSQL via Supabase :
   - Creer un projet Supabase
   - Mettre a jour `DATABASE_URL` dans les variables d'environnement Vercel
   - Changer le provider dans `prisma/schema.prisma` de `sqlite` a `postgresql`
   - Relancer les migrations

### Variables d'environnement

```
DATABASE_URL="file:./dev.db"     # SQLite local
ALERT_EMAIL="votre@email.com"    # Email pour les alertes
```

## Structure du projet

```
src/
  app/
    api/                 # API Routes
      puzzles/           # CRUD puzzles
      collection/        # Gestion collection
      listings/          # Annonces marche
      alerts/            # Alertes
      export/            # Export CSV
      import/            # Import CSV
    gallery/             # Page galerie
    collection/          # Page collection
    market/              # Page marche
    alerts/              # Page alertes
    settings/            # Page parametres
    page.tsx             # Dashboard
  components/            # Composants reutilisables
    ui/                  # Composants UI de base
    PuzzleCard.tsx       # Carte puzzle
    StatsCard.tsx        # Carte statistique
    Sidebar.tsx          # Navigation laterale
  lib/
    prisma.ts            # Client Prisma singleton

prisma/
  schema.prisma          # Schema de base de donnees
  seed.cjs               # Donnees de demonstration
  migrations/            # Migrations SQL
```

## Compte par defaut

- Email : jhoussiere@yahoo.fr
- Mot de passe : admin123
