'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  Film,
  Database,
  Lock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Radio,
  Sliders,
  History,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: 'Executive KPIs', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User & Roles', icon: Users },
    { href: '/admin/pages', label: 'Page Verification', icon: CheckCircle },
    { href: '/admin/campaigns', label: 'Campaign Control', icon: Film },
    { href: '/admin/assets', label: 'Asset & Edit Registry', icon: Database },
    { href: '/admin/assignments', label: 'Distribution 1:1 Operations', icon: Lock, highlight: true },
    { href: '/admin/finance', label: 'Finance & Ledger', icon: DollarSign },
    { href: '/admin/analytics', label: 'Business Intelligence', icon: TrendingUp },
    { href: '/admin/disputes', label: 'Disputes & DMCA', icon: AlertTriangle },
    { href: '/admin/integrations', label: 'Platform Integrations', icon: Radio },
    { href: '/admin/settings', label: 'Platform & AI Settings', icon: Sliders },
    { href: '/admin/audit-logs', label: 'Immutable Audit Trail', icon: History },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 space-y-6 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        <div className="px-3 py-2 bg-rose-950/30 border border-rose-500/20 rounded-xl">
          <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">Super Administrator</div>
          <div className="font-semibold text-slate-100 text-sm truncate">Platform Operations</div>
          <div className="text-xs text-slate-400">Executive & Governance</div>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : item.highlight
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs space-y-1 text-slate-400">
        <div className="font-semibold text-slate-300">Audit & Governance</div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Privileged actions, assignment commits, and payout settlements are cryptographically logged with IP and timestamps.
        </p>
      </div>
    </aside>
  );
}
