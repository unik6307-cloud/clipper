'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Scissors,
  CheckSquare,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export function TeamSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/team/dashboard', label: 'Team Work Queue', icon: LayoutDashboard },
    { href: '/team/editing', label: 'Editing Workspace', icon: Scissors },
    { href: '/team/quality-review', label: 'Quality Review (QA)', icon: CheckSquare },
    { href: '/team/campaign-operations', label: 'Campaign Operations', icon: Activity },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 space-y-6 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        <div className="px-3 py-2 bg-cyan-950/30 border border-cyan-500/20 rounded-xl">
          <div className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">Internal Production</div>
          <div className="font-semibold text-slate-100 text-sm truncate">Studio & Quality Operations</div>
          <div className="text-xs text-slate-400">Editor & QA Role</div>
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
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs space-y-1.5 text-slate-400">
        <div className="font-semibold text-slate-300">Production Standard</div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          All clips must meet EBU R128 audio limits, 9:16 vertical ratio, accurate subtitles, and clear hook tags before submission to QA.
        </p>
      </div>
    </aside>
  );
}
