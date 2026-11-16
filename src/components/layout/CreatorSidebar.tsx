'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  Scissors,
  Compass,
  MapPin,
  BarChart3,
  CreditCard,
  MessageSquare,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export function CreatorSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/creator/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/creator/campaigns', label: 'My Campaigns', icon: Film },
    { href: '/creator/campaigns/new', label: 'New Campaign Wizard', icon: PlusCircle, highlight: true },
    { href: '/creator/studio', label: 'Editing Studio & QA', icon: Scissors },
    { href: '/creator/discover', label: 'AI Page Discovery', icon: Compass },
    { href: '/creator/placements', label: 'Placements (1:1 Locks)', icon: MapPin },
    { href: '/creator/analytics', label: 'Performance Analytics', icon: BarChart3 },
    { href: '/creator/billing', label: 'Billing & Invoices', icon: CreditCard },
    { href: '/creator/messages', label: 'Team Messages', icon: MessageSquare },
    { href: '/creator/settings', label: 'Profile & Rights', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 space-y-6 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        <div className="px-3 py-2 bg-emerald-950/30 border border-emerald-500/20 rounded-xl">
          <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Active Workspace</div>
          <div className="font-semibold text-slate-100 text-sm truncate">Acme Media Labs</div>
          <div className="text-xs text-slate-400">Creator Portal</div>
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
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : item.highlight
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30 hover:bg-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs space-y-1.5 text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strict 1:1 Guarantee</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Your finished edits are never broadcast or shared across multiple social pages. Each Edit ID is strictly locked to one page.
        </p>
      </div>
    </aside>
  );
}
