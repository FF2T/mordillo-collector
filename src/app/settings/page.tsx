'use client';

import { useState } from 'react';
import { Settings, Mail, Bell, Database, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const [alertEmail, setAlertEmail] = useState('jhoussiere@yahoo.fr');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted mt-1">Configuration de votre application</p>
      </div>

      {/* Email alerts */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
            <Mail size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="font-semibold">Alertes email</h2>
            <p className="text-xs text-muted">Recevez les alertes par email</p>
          </div>
        </div>
        <div>
          <label className="text-sm text-muted">Adresse email</label>
          <input
            type="email"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
            <Bell size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="font-semibold">Notifications</h2>
            <p className="text-xs text-muted">Types d&apos;alertes activées</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Puzzle manquant en vente', desc: 'Quand un puzzle que vous ne possédez pas est listé' },
            { label: 'Puzzle rare détecté', desc: 'Quand un puzzle rare ou ultra-rare apparaît' },
            { label: 'Bonne affaire', desc: 'Quand un prix est bien en dessous de la moyenne' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Market monitoring */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
            <Monitor size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="font-semibold">Monitoring des plateformes</h2>
            <p className="text-xs text-muted">Plateformes surveillées</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { name: 'eBay', status: 'Actif', color: 'text-emerald-400' },
            { name: 'Vinted', status: 'Actif', color: 'text-emerald-400' },
            { name: 'Leboncoin', status: 'Actif', color: 'text-emerald-400' },
          ].map((platform) => (
            <div key={platform.name} className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-sm font-medium">{platform.name}</span>
              <span className={`text-xs font-medium ${platform.color}`}>{platform.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Database info */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
            <Database size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="font-semibold">Base de données</h2>
            <p className="text-xs text-muted">SQLite (local) — migrable vers PostgreSQL</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 bg-accent hover:bg-accent-hover text-black font-medium rounded-xl transition-colors"
      >
        {saved ? 'Sauvegardé !' : 'Sauvegarder les paramètres'}
      </button>
    </div>
  );
}
