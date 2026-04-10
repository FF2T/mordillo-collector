'use client';

import { useEffect, useState, useCallback } from 'react';
import { PuzzleCard } from '@/components/PuzzleCard';
import { Modal } from '@/components/ui/Modal';
import { RarityBadge } from '@/components/ui/Badge';
import {
  Search,
  Plus,
  Filter,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface PuzzleData {
  id: number;
  name: string;
  image?: string | null;
  publisher: string;
  year?: number | null;
  reference?: string | null;
  dimensions?: string | null;
  edition: string;
  rarity: string;
  estimatedPrice?: number | null;
  description?: string | null;
  flagged?: boolean;
  owned?: boolean;
}

interface PuzzleDetail extends PuzzleData {
  collectionItem?: {
    id: number;
    condition: string;
    boxCondition?: string | null;
    purchasePrice?: number | null;
    purchaseDate?: string | null;
    notes?: string | null;
  } | null;
  priceStats?: { avg: number; min: number; max: number } | null;
  dealScore?: number | null;
  marketListings?: Array<{
    id: number;
    title: string;
    price?: number | null;
    source: string;
    listingUrl: string;
  }>;
}

const publishers = ['Heye', 'Clementoni', 'Ravensburger', 'Educa', 'Grafika'];
const rarities = ['common', 'uncommon', 'rare', 'very_rare', 'ultra_rare'];
const rarityLabels: Record<string, string> = {
  common: 'Commun',
  uncommon: 'Peu commun',
  rare: 'Rare',
  very_rare: 'Très rare',
  ultra_rare: 'Ultra rare',
};

export default function GalleryPage() {
  const [puzzles, setPuzzles] = useState<PuzzleData[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [publisher, setPublisher] = useState('');
  const [rarity, setRarity] = useState('');
  const [owned, setOwned] = useState('');
  const [sort, setSort] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleDetail | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  // Add puzzle form
  const [newPuzzle, setNewPuzzle] = useState({
    name: '', publisher: 'Heye', year: '', reference: '', dimensions: '',
    edition: 'Standard', rarity: 'common', estimatedPrice: '', description: '',
  });

  // Collection form
  const [collectionForm, setCollectionForm] = useState({
    condition: 'complete', boxCondition: '', purchasePrice: '', purchaseDate: '', notes: '',
  });

  const [flagNote, setFlagNote] = useState('');

  const loadPuzzles = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (publisher) params.set('publisher', publisher);
    if (rarity) params.set('rarity', rarity);
    if (owned) params.set('owned', owned);
    params.set('sort', sort);
    params.set('limit', '100');

    fetch(`/api/puzzles?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setPuzzles(d.puzzles);
        setTotal(d.total);
      });
  }, [search, publisher, rarity, owned, sort]);

  useEffect(() => {
    const timer = setTimeout(loadPuzzles, 300);
    return () => clearTimeout(timer);
  }, [loadPuzzles]);

  const openDetail = async (id: number) => {
    const res = await fetch(`/api/puzzles/${id}`);
    const data = await res.json();
    setSelectedPuzzle(data);
  };

  const addToCollection = async () => {
    if (!selectedPuzzle) return;
    await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzleId: selectedPuzzle.id, ...collectionForm }),
    });
    setShowCollectionModal(false);
    setCollectionForm({ condition: 'complete', boxCondition: '', purchasePrice: '', purchaseDate: '', notes: '' });
    openDetail(selectedPuzzle.id);
    loadPuzzles();
  };

  const removeFromCollection = async () => {
    if (!selectedPuzzle?.collectionItem) return;
    await fetch(`/api/collection/${selectedPuzzle.collectionItem.id}`, { method: 'DELETE' });
    openDetail(selectedPuzzle.id);
    loadPuzzles();
  };

  const createPuzzle = async () => {
    await fetch('/api/puzzles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPuzzle),
    });
    setShowAddModal(false);
    setNewPuzzle({ name: '', publisher: 'Heye', year: '', reference: '', dimensions: '', edition: 'Standard', rarity: 'common', estimatedPrice: '', description: '' });
    loadPuzzles();
  };

  const flagPuzzle = async () => {
    if (!selectedPuzzle) return;
    await fetch(`/api/puzzles/${selectedPuzzle.id}/flag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: flagNote }),
    });
    setShowFlagModal(false);
    setFlagNote('');
    openDetail(selectedPuzzle.id);
    loadPuzzles();
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Galerie</h1>
          <p className="text-muted mt-1">{total} puzzles au catalogue</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-black font-medium rounded-xl transition-colors"
        >
          <Plus size={18} />
          Ajouter un puzzle
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Rechercher par nom, référence, éditeur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-accent/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm transition-colors ${
              showFilters ? 'bg-accent-muted border-accent/50 text-accent' : 'bg-card border-border text-muted hover:text-foreground'
            }`}
          >
            <Filter size={16} />
            Filtres
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-card border border-border rounded-xl">
            <select
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="">Tous les éditeurs</option>
              {publishers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="">Toutes raretés</option>
              {rarities.map((r) => (
                <option key={r} value={r}>{rarityLabels[r]}</option>
              ))}
            </select>
            <select
              value={owned}
              onChange={(e) => setOwned(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="">Tous</option>
              <option value="true">Possédés</option>
              <option value="false">Manquants</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="name">Nom</option>
              <option value="year">Année</option>
              <option value="rarity">Rareté</option>
              <option value="estimatedPrice">Prix</option>
            </select>
            {(publisher || rarity || owned) && (
              <button
                onClick={() => { setPublisher(''); setRarity(''); setOwned(''); }}
                className="px-3 py-2 text-sm text-danger hover:underline"
              >
                Réinitialiser
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {puzzles.map((p) => (
          <PuzzleCard
            key={p.id}
            puzzle={p}
            owned={p.owned}
            onClick={() => openDetail(p.id)}
          />
        ))}
      </div>

      {puzzles.length === 0 && (
        <div className="text-center py-20 text-muted">
          Aucun puzzle trouvé
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        open={!!selectedPuzzle}
        onClose={() => setSelectedPuzzle(null)}
        title={selectedPuzzle?.name || ''}
      >
        {selectedPuzzle && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted">Éditeur</span>
                <p className="font-medium">{selectedPuzzle.publisher}</p>
              </div>
              <div>
                <span className="text-muted">Année</span>
                <p className="font-medium">{selectedPuzzle.year || '—'}</p>
              </div>
              <div>
                <span className="text-muted">Référence</span>
                <p className="font-medium">{selectedPuzzle.reference || '—'}</p>
              </div>
              <div>
                <span className="text-muted">Dimensions</span>
                <p className="font-medium">{selectedPuzzle.dimensions || '—'}</p>
              </div>
              <div>
                <span className="text-muted">Édition</span>
                <p className="font-medium">{selectedPuzzle.edition}</p>
              </div>
              <div>
                <span className="text-muted">Rareté</span>
                <p><RarityBadge rarity={selectedPuzzle.rarity} /></p>
              </div>
              <div>
                <span className="text-muted">Prix estimé</span>
                <p className="font-medium text-accent">
                  {selectedPuzzle.estimatedPrice ? `${selectedPuzzle.estimatedPrice} €` : '—'}
                </p>
              </div>
              {selectedPuzzle.priceStats && (
                <div>
                  <span className="text-muted">Prix observés</span>
                  <p className="font-medium text-xs">
                    {selectedPuzzle.priceStats.min.toFixed(0)}–{selectedPuzzle.priceStats.max.toFixed(0)} € (moy: {selectedPuzzle.priceStats.avg.toFixed(0)} €)
                  </p>
                </div>
              )}
            </div>

            {selectedPuzzle.description && (
              <p className="text-sm text-muted">{selectedPuzzle.description}</p>
            )}

            {/* Collection status */}
            {selectedPuzzle.owned && selectedPuzzle.collectionItem ? (
              <div className="p-4 bg-emerald-900/20 border border-emerald-800/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                  <Check size={16} />
                  Dans votre collection
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted">État:</span> {selectedPuzzle.collectionItem.condition}</div>
                  {selectedPuzzle.collectionItem.boxCondition && (
                    <div><span className="text-muted">Boîte:</span> {selectedPuzzle.collectionItem.boxCondition}</div>
                  )}
                  {selectedPuzzle.collectionItem.purchasePrice && (
                    <div><span className="text-muted">Prix:</span> {selectedPuzzle.collectionItem.purchasePrice} €</div>
                  )}
                  {selectedPuzzle.collectionItem.notes && (
                    <div className="col-span-2"><span className="text-muted">Notes:</span> {selectedPuzzle.collectionItem.notes}</div>
                  )}
                </div>
                <button
                  onClick={removeFromCollection}
                  className="text-xs text-red-400 hover:underline mt-2"
                >
                  Retirer de la collection
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCollectionModal(true)}
                className="w-full py-2.5 bg-accent hover:bg-accent-hover text-black font-medium rounded-xl transition-colors text-sm"
              >
                Ajouter à ma collection
              </button>
            )}

            {/* Active listings */}
            {selectedPuzzle.marketListings && selectedPuzzle.marketListings.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Annonces actives</h4>
                <div className="space-y-2">
                  {selectedPuzzle.marketListings.map((l) => (
                    <a
                      key={l.id}
                      href={l.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-background border border-border rounded-lg text-xs hover:border-accent/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{l.title}</p>
                        <p className="text-muted capitalize">{l.source}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {l.price && <span className="font-bold text-accent">{l.price} €</span>}
                        <ExternalLink size={14} className="text-muted" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Flag button */}
            <button
              onClick={() => setShowFlagModal(true)}
              className="flex items-center gap-2 text-xs text-muted hover:text-amber-400 transition-colors"
            >
              <AlertTriangle size={14} />
              Signaler données incertaines
            </button>
          </div>
        )}
      </Modal>

      {/* Add to Collection Modal */}
      <Modal open={showCollectionModal} onClose={() => setShowCollectionModal(false)} title="Ajouter à ma collection">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted">État</label>
            <select
              value={collectionForm.condition}
              onChange={(e) => setCollectionForm({ ...collectionForm, condition: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="new">Neuf</option>
              <option value="complete">Complet</option>
              <option value="used">Utilisé</option>
              <option value="incomplete">Incomplet</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted">État de la boîte</label>
            <input
              type="text"
              placeholder="Ex: Très bon état, légère usure..."
              value={collectionForm.boxCondition}
              onChange={(e) => setCollectionForm({ ...collectionForm, boxCondition: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted">Prix d&apos;achat (€)</label>
              <input
                type="number"
                value={collectionForm.purchasePrice}
                onChange={(e) => setCollectionForm({ ...collectionForm, purchasePrice: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted">Date d&apos;achat</label>
              <input
                type="date"
                value={collectionForm.purchaseDate}
                onChange={(e) => setCollectionForm({ ...collectionForm, purchaseDate: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted">Notes</label>
            <textarea
              value={collectionForm.notes}
              onChange={(e) => setCollectionForm({ ...collectionForm, notes: e.target.value })}
              rows={2}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none"
            />
          </div>
          <button
            onClick={addToCollection}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover text-black font-medium rounded-xl transition-colors"
          >
            Confirmer
          </button>
        </div>
      </Modal>

      {/* Add Puzzle Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Ajouter un puzzle">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted">Nom *</label>
            <input
              type="text"
              value={newPuzzle.name}
              onChange={(e) => setNewPuzzle({ ...newPuzzle, name: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
              placeholder="Ex: Mordillo - The Match"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted">Éditeur</label>
              <select
                value={newPuzzle.publisher}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, publisher: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                {publishers.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted">Année</label>
              <input
                type="number"
                value={newPuzzle.year}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, year: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                placeholder="2020"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted">Référence</label>
              <input
                type="text"
                value={newPuzzle.reference}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, reference: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted">Rareté</label>
              <select
                value={newPuzzle.rarity}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, rarity: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                {rarities.map((r) => <option key={r} value={r}>{rarityLabels[r]}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted">Dimensions</label>
              <input
                type="text"
                value={newPuzzle.dimensions}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, dimensions: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                placeholder="50 x 70 cm"
              />
            </div>
            <div>
              <label className="text-sm text-muted">Prix estimé (€)</label>
              <input
                type="number"
                value={newPuzzle.estimatedPrice}
                onChange={(e) => setNewPuzzle({ ...newPuzzle, estimatedPrice: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted">Description</label>
            <textarea
              value={newPuzzle.description}
              onChange={(e) => setNewPuzzle({ ...newPuzzle, description: e.target.value })}
              rows={2}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none"
            />
          </div>
          <button
            onClick={createPuzzle}
            disabled={!newPuzzle.name}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover text-black font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Créer le puzzle
          </button>
        </div>
      </Modal>

      {/* Flag Modal */}
      <Modal open={showFlagModal} onClose={() => setShowFlagModal(false)} title="Signaler ce puzzle">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Indiquez pourquoi les données de ce puzzle sont incertaines ou incomplètes.
          </p>
          <textarea
            value={flagNote}
            onChange={(e) => setFlagNote(e.target.value)}
            rows={3}
            placeholder="Ex: Année de sortie incertaine, possiblement 1995 et non 1997..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none"
          />
          <button
            onClick={flagPuzzle}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors"
          >
            Signaler
          </button>
        </div>
      </Modal>
    </div>
  );
}
