'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { PuzzleCard } from '@/components/PuzzleCard';
import {
  Puzzle,
  Library,
  TrendingUp,
  Target,
  Star,
  AlertCircle,
} from 'lucide-react';

interface Stats {
  totalPuzzles: number;
  ownedCount: number;
  completionPercentage: number;
  totalValue: number;
  estimatedTotalValue: number;
  missingCount: number;
  rarePuzzlesOwned: number;
}

interface PuzzleData {
  id: number;
  name: string;
  image?: string | null;
  publisher: string;
  year?: number | null;
  rarity: string;
  estimatedPrice?: number | null;
  edition: string;
  flagged?: boolean;
  owned?: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPuzzles, setRecentPuzzles] = useState<PuzzleData[]>([]);
  const [missingRare, setMissingRare] = useState<PuzzleData[]>([]);

  useEffect(() => {
    fetch('/api/collection/stats').then((r) => r.json()).then(setStats);
    fetch('/api/puzzles?sort=createdAt&order=desc&limit=4')
      .then((r) => r.json())
      .then((d) => setRecentPuzzles(d.puzzles));
    fetch('/api/puzzles?owned=false&rarity=rare&limit=4')
      .then((r) => r.json())
      .then((d) => {
        // Also fetch very_rare and ultra_rare
        Promise.all([
          fetch('/api/puzzles?owned=false&rarity=very_rare&limit=4').then((r) => r.json()),
          fetch('/api/puzzles?owned=false&rarity=ultra_rare&limit=4').then((r) => r.json()),
        ]).then(([vr, ur]) => {
          setMissingRare([...d.puzzles, ...vr.puzzles, ...ur.puzzles].slice(0, 4));
        });
      });
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted mt-1">Vue d&apos;ensemble de votre collection Mordillo</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard
            icon={Puzzle}
            label="Total puzzles"
            value={stats.totalPuzzles}
          />
          <StatsCard
            icon={Library}
            label="Possédés"
            value={stats.ownedCount}
            accentColor="text-emerald-400"
          />
          <StatsCard
            icon={Target}
            label="Progression"
            value={`${stats.completionPercentage}%`}
            accentColor="text-accent"
          />
          <StatsCard
            icon={TrendingUp}
            label="Valeur collection"
            value={`${stats.estimatedTotalValue} €`}
            accentColor="text-accent"
          />
          <StatsCard
            icon={AlertCircle}
            label="Manquants"
            value={stats.missingCount}
            accentColor="text-red-400"
          />
          <StatsCard
            icon={Star}
            label="Rares possédés"
            value={stats.rarePuzzlesOwned}
            accentColor="text-purple-400"
          />
        </div>
      )}

      {/* Progress Bar */}
      {stats && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Progression de la collection</h2>
            <span className="text-accent font-bold">{stats.completionPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted">
            <span>{stats.ownedCount} possédés</span>
            <span>{stats.missingCount} manquants</span>
          </div>
        </div>
      )}

      {/* Recent Puzzles */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Derniers ajouts au catalogue</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentPuzzles.map((p) => (
            <PuzzleCard key={p.id} puzzle={p} owned={p.owned} />
          ))}
        </div>
      </div>

      {/* Missing Rare */}
      {missingRare.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Puzzles rares manquants</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {missingRare.map((p) => (
              <PuzzleCard key={p.id} puzzle={p} owned={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
