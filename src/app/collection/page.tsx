'use client';

import { useEffect, useState } from 'react';
import { RarityBadge } from '@/components/ui/Badge';
import { Download, Upload, Trash2, Edit3, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface CollectionItemData {
  id: number;
  condition: string;
  boxCondition?: string | null;
  purchasePrice?: number | null;
  purchaseDate?: string | null;
  notes?: string | null;
  puzzle: {
    id: number;
    name: string;
    publisher: string;
    year?: number | null;
    rarity: string;
    estimatedPrice?: number | null;
    reference?: string | null;
  };
}

const conditionLabels: Record<string, string> = {
  new: 'Neuf',
  complete: 'Complet',
  used: 'Utilisé',
  incomplete: 'Incomplet',
};

export default function CollectionPage() {
  const [items, setItems] = useState<CollectionItemData[]>([]);
  const [editItem, setEditItem] = useState<CollectionItemData | null>(null);
  const [editForm, setEditForm] = useState({
    condition: '', boxCondition: '', purchasePrice: '', purchaseDate: '', notes: '',
  });

  const loadCollection = () => {
    fetch('/api/collection').then((r) => r.json()).then(setItems);
  };

  useEffect(() => { loadCollection(); }, []);

  const startEdit = (item: CollectionItemData) => {
    setEditItem(item);
    setEditForm({
      condition: item.condition,
      boxCondition: item.boxCondition || '',
      purchasePrice: item.purchasePrice?.toString() || '',
      purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
      notes: item.notes || '',
    });
  };

  const saveEdit = async () => {
    if (!editItem) return;
    await fetch(`/api/collection/${editItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditItem(null);
    loadCollection();
  };

  const removeItem = async (id: number) => {
    if (!confirm('Retirer ce puzzle de votre collection ?')) return;
    await fetch(`/api/collection/${id}`, { method: 'DELETE' });
    loadCollection();
  };

  const exportCSV = () => {
    window.open('/api/export', '_blank');
  };

  const importCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/import', { method: 'POST', body: formData });
    const data = await res.json();
    alert(data.message);
    loadCollection();
    e.target.value = '';
  };

  const totalValue = items.reduce((sum, i) => sum + (i.purchasePrice || i.puzzle.estimatedPrice || 0), 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ma Collection</h1>
          <p className="text-muted mt-1">
            {items.length} puzzles &middot; Valeur totale: {totalValue.toFixed(0)} €
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm hover:border-accent/50 transition-colors"
          >
            <Download size={16} />
            Exporter CSV
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm hover:border-accent/50 transition-colors cursor-pointer">
            <Upload size={16} />
            Importer CSV
            <input type="file" accept=".csv" onChange={importCSV} className="hidden" />
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-6 py-4 font-medium">Puzzle</th>
                <th className="px-4 py-4 font-medium">Éditeur</th>
                <th className="px-4 py-4 font-medium">Année</th>
                <th className="px-4 py-4 font-medium">Rareté</th>
                <th className="px-4 py-4 font-medium">État</th>
                <th className="px-4 py-4 font-medium">Prix achat</th>
                <th className="px-4 py-4 font-medium">Valeur est.</th>
                <th className="px-4 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center">
                        <Check size={14} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{item.puzzle.name}</p>
                        {item.puzzle.reference && (
                          <p className="text-xs text-muted">Réf: {item.puzzle.reference}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted">{item.puzzle.publisher}</td>
                  <td className="px-4 py-4 text-muted">{item.puzzle.year || '—'}</td>
                  <td className="px-4 py-4"><RarityBadge rarity={item.puzzle.rarity} /></td>
                  <td className="px-4 py-4">{conditionLabels[item.condition] || item.condition}</td>
                  <td className="px-4 py-4">
                    {item.purchasePrice ? `${item.purchasePrice} €` : '—'}
                  </td>
                  <td className="px-4 py-4 text-accent">
                    {item.puzzle.estimatedPrice ? `${item.puzzle.estimatedPrice} €` : '—'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 rounded-lg hover:bg-background transition-colors text-muted hover:text-foreground"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-background transition-colors text-muted hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="text-center py-16 text-muted">
            Votre collection est vide. Allez dans la Galerie pour ajouter des puzzles.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Modifier l'entrée">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted">État</label>
            <select
              value={editForm.condition}
              onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
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
              value={editForm.boxCondition}
              onChange={(e) => setEditForm({ ...editForm, boxCondition: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted">Prix d&apos;achat (€)</label>
              <input
                type="number"
                value={editForm.purchasePrice}
                onChange={(e) => setEditForm({ ...editForm, purchasePrice: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted">Date d&apos;achat</label>
              <input
                type="date"
                value={editForm.purchaseDate}
                onChange={(e) => setEditForm({ ...editForm, purchaseDate: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted">Notes</label>
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              rows={2}
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none"
            />
          </div>
          <button
            onClick={saveEdit}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover text-black font-medium rounded-xl transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </Modal>
    </div>
  );
}
