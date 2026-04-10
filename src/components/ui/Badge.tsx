'use client';

const rarityColors: Record<string, string> = {
  common: 'bg-zinc-700 text-zinc-300',
  uncommon: 'bg-emerald-900/50 text-emerald-400',
  rare: 'bg-blue-900/50 text-blue-400',
  very_rare: 'bg-purple-900/50 text-purple-400',
  ultra_rare: 'bg-amber-900/50 text-amber-400',
};

const rarityLabels: Record<string, string> = {
  common: 'Commun',
  uncommon: 'Peu commun',
  rare: 'Rare',
  very_rare: 'Très rare',
  ultra_rare: 'Ultra rare',
};

export function RarityBadge({ rarity }: { rarity: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        rarityColors[rarity] || rarityColors.common
      }`}
    >
      {rarityLabels[rarity] || rarity}
    </span>
  );
}

export function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const colors = {
    default: 'bg-zinc-700 text-zinc-300',
    success: 'bg-emerald-900/50 text-emerald-400',
    warning: 'bg-amber-900/50 text-amber-400',
    danger: 'bg-red-900/50 text-red-400',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[variant]}`}
    >
      {children}
    </span>
  );
}
