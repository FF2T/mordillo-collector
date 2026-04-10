'use client';

import { useEffect, useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, Star, Puzzle, ExternalLink } from 'lucide-react';

interface AlertData {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  puzzle?: { id: number; name: string } | null;
  listing?: { id: number; title: string; price?: number | null; listingUrl: string; source: string } | null;
}

const typeIcons: Record<string, typeof Bell> = {
  missing_puzzle: Puzzle,
  rare_listing: Star,
  good_deal: AlertTriangle,
};

const typeLabels: Record<string, string> = {
  missing_puzzle: 'Puzzle manquant repéré',
  rare_listing: 'Puzzle rare en vente',
  good_deal: 'Bonne affaire',
};

const typeColors: Record<string, string> = {
  missing_puzzle: 'text-blue-400',
  rare_listing: 'text-purple-400',
  good_deal: 'text-emerald-400',
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const loadAlerts = () => {
    fetch('/api/alerts').then((r) => r.json()).then(setAlerts);
  };

  useEffect(() => { loadAlerts(); }, []);

  const markAllRead = async () => {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    loadAlerts();
  };

  const markRead = async (id: number) => {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadAlerts();
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alertes</h1>
          <p className="text-muted mt-1">
            {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Toutes lues'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm hover:border-accent/50 transition-colors"
          >
            <CheckCheck size={16} />
            Tout marquer lu
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 bg-accent-muted border border-accent/20 rounded-xl text-sm">
        <p className="text-accent font-medium">Système d&apos;alertes intelligent</p>
        <p className="text-muted mt-1">
          Vous recevrez des alertes quand un puzzle manquant de votre collection apparaît en vente,
          quand un puzzle rare est listé, ou quand une bonne affaire est détectée.
          Les alertes sont aussi envoyées par email à {process.env.NEXT_PUBLIC_ALERT_EMAIL || 'votre adresse configurée'}.
        </p>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = typeIcons[alert.type] || Bell;
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-4 p-4 bg-card border rounded-xl transition-colors ${
                alert.isRead ? 'border-border opacity-60' : 'border-accent/30'
              }`}
            >
              <div className={`mt-0.5 ${typeColors[alert.type] || 'text-muted'}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted uppercase">
                    {typeLabels[alert.type] || alert.type}
                  </span>
                  {!alert.isRead && (
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <p className="text-sm">{alert.message}</p>
                {alert.listing && (
                  <a
                    href={alert.listing.listingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-accent hover:underline"
                  >
                    Voir l&apos;annonce ({alert.listing.source})
                    {alert.listing.price && ` - ${alert.listing.price} €`}
                    <ExternalLink size={12} />
                  </a>
                )}
                <p className="text-xs text-muted mt-1">
                  {new Date(alert.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              {!alert.isRead && (
                <button
                  onClick={() => markRead(alert.id)}
                  className="text-xs text-muted hover:text-foreground transition-colors whitespace-nowrap"
                >
                  Marquer lu
                </button>
              )}
            </div>
          );
        })}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-20 text-muted">
          <Bell size={40} className="mx-auto mb-4 opacity-30" />
          Aucune alerte pour le moment.
        </div>
      )}
    </div>
  );
}
