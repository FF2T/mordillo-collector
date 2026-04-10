'use client';

import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  accentColor?: string;
}

export function StatsCard({ icon: Icon, label, value, subtitle, accentColor }: StatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{label}</p>
          <p className={`text-3xl font-bold ${accentColor || 'text-foreground'}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center">
          <Icon size={22} className="text-accent" />
        </div>
      </div>
    </div>
  );
}
