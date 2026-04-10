'use client';

import { RarityBadge } from '@/components/ui/Badge';
import { Check, AlertTriangle } from 'lucide-react';

interface PuzzleCardProps {
  puzzle: {
    id: number;
    name: string;
    image?: string | null;
    publisher: string;
    year?: number | null;
    rarity: string;
    estimatedPrice?: number | null;
    edition: string;
    flagged?: boolean;
  };
  owned?: boolean;
  onClick?: () => void;
}

function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 60%, 25%)`;
}

export function PuzzleCard({ puzzle, owned, onClick }: PuzzleCardProps) {
  const bg1 = hashColor(puzzle.name);
  const bg2 = hashColor(puzzle.name + puzzle.publisher);

  return (
    <div
      onClick={onClick}
      className="group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5"
    >
      {/* Image or gradient placeholder */}
      <div
        className="relative aspect-square"
        style={{
          background: puzzle.image
            ? undefined
            : `linear-gradient(135deg, ${bg1}, ${bg2})`,
        }}
      >
        {puzzle.image ? (
          <img
            src={puzzle.image}
            alt={puzzle.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white/20">
              {puzzle.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Owned badge */}
        {owned && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
            <Check size={16} className="text-white" />
          </div>
        )}

        {/* Flagged indicator */}
        {puzzle.flagged && (
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <AlertTriangle size={14} className="text-white" />
          </div>
        )}

        {/* Rarity */}
        <div className="absolute bottom-3 left-3">
          <RarityBadge rarity={puzzle.rarity} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate group-hover:text-accent transition-colors">
          {puzzle.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted">{puzzle.publisher}</span>
          {puzzle.year && (
            <span className="text-xs text-muted">{puzzle.year}</span>
          )}
        </div>
        {puzzle.estimatedPrice != null && (
          <div className="mt-2 text-accent font-semibold text-sm">
            ~{puzzle.estimatedPrice.toFixed(0)} €
          </div>
        )}
      </div>
    </div>
  );
}
