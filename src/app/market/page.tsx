'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { ExternalLink, ShoppingCart, Star } from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  price?: number | null;
  source: string;
  listingUrl: string;
  imageUrl?: string | null;
  condition?: string | null;
  hasOriginalBox?: boolean | null;
  isComplete?: boolean | null;
  detectedAt: string;
  dealScore?: number | null;
  puzzle?: {
    id: number;
    name: string;
    estimatedPrice?: number | null;
  } | null;
}

const sourceColors: Record<string, string> = {
  ebay: 'bg-blue-900/50 text-blue-400',
  vinted: 'bg-teal-900/50 text-teal-400',
  leboncoin: 'bg-orange-900/50 text-orange-400',
};

export default function MarketPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [source, setSource] = useState('');
  const [matched, setMatched] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (source) params.set('source', source);
    if (matched) params.set('matched', matched);
    params.set('limit', '50');

    fetch(`/api/listings?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setListings(d.listings);
        setTotal(d.total);
      });
  }, [source, matched]);

  const getDealColor = (score: number | null | undefined) => {
    if (!score) return '';
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-accent';
    if (score >= 4) return 'text-muted';
    return 'text-red-400';
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marché</h1>
        <p className="text-muted mt-1">
          {total} annonces actives détectées
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        >
          <option value="">Toutes les plateformes</option>
          <option value="ebay">eBay</option>
          <option value="vinted">Vinted</option>
          <option value="leboncoin">Leboncoin</option>
        </select>
        <select
          value={matched}
          onChange={(e) => setMatched(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        >
          <option value="">Toutes les annonces</option>
          <option value="true">Matchées</option>
          <option value="false">Non matchées</option>
        </select>
      </div>

      {/* Info banner */}
      <div className="p-4 bg-accent-muted border border-accent/20 rounded-xl text-sm">
        <div className="flex items-center gap-2 text-accent font-medium">
          <ShoppingCart size={16} />
          Monitoring des plateformes
        </div>
        <p className="text-muted mt-1">
          Le système surveille eBay, Vinted et Leboncoin pour détecter les puzzles Mordillo 1000 pièces.
          Les annonces sont automatiquement matchées avec le catalogue quand c&apos;est possible.
        </p>
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {listings.map((listing) => (
          <a
            key={listing.id}
            href={listing.listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-accent/50 transition-colors group"
          >
            {/* Image placeholder */}
            <div className="w-16 h-16 rounded-lg bg-background flex-shrink-0 overflow-hidden">
              {listing.imageUrl ? (
                <img src={listing.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  <ShoppingCart size={20} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${sourceColors[listing.source] || 'bg-zinc-700 text-zinc-300'}`}>
                  {listing.source}
                </span>
                {listing.puzzle && (
                  <Badge variant="success">Matchée: {listing.puzzle.name}</Badge>
                )}
              </div>
              <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                {listing.title}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                {listing.condition && <span>État: {listing.condition}</span>}
                {listing.hasOriginalBox && <span>Boîte originale</span>}
                {listing.isComplete && <span>Complet</span>}
                <span>{new Date(listing.detectedAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              {listing.price && (
                <p className="text-lg font-bold text-accent">{listing.price} €</p>
              )}
              {listing.dealScore && (
                <div className={`flex items-center gap-1 text-xs ${getDealColor(listing.dealScore)}`}>
                  <Star size={12} />
                  Deal: {listing.dealScore}/10
                </div>
              )}
              <ExternalLink size={14} className="text-muted mt-1 ml-auto" />
            </div>
          </a>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-20 text-muted">
          Aucune annonce détectée pour le moment.
          <br />
          <span className="text-xs">Le monitoring est en cours d&apos;exécution.</span>
        </div>
      )}
    </div>
  );
}
