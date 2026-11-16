'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Share2,
  PlusCircle,
  Inbox,
  Download,
  Send,
  BarChart3,
  DollarSign,
  Settings,
  AlertCircle,
} from 'lucide-react';

export function PartnerSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/partner/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/partner/pages', label: 'My Social Pages', icon: Share2 },
    { href: '/partner/pages/new', label: 'Register New Page', icon: PlusCircle, highlight: true },
    { href: '/partner/invitations', label: 'Campaign Invitations', icon: Inbox },
    { href: '/partner/assignments', label: 'My Assignments & Downloads', icon: Download },
    { href: '/partner/submit-post', label: 'Submit Live Post URL', icon: Send },
    { href: '/partner/analytics', label: 'Page Performance', icon: BarChart3 },
    { href: '/partner/earnings', label: 'Earnings & Payouts', icon: DollarSign },
    { href: '/partner/settings', label: 'Partner Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 space-y-6 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        <div className="px-3 py-2 bg-indigo-950/30 border border-indigo-500/20 rounded-xl">
          <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">Distribution Partner</div>
          <div className="font-semibold text-slate-100 text-sm truncate">DevNetwork Media</div>
          <div className="text-xs text-slate-400">3 Verified Social Pages</div>
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
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : item.highlight
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-xs space-y-1.5 text-amber-200/80">
        <div className="flex items-center gap-1.5 font-semibold text-amber-300">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Publishing Rule</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-300/70">
          Distribution partners do not edit videos. You publish the approved creative on your assigned page and submit the live URL for automated verification.
        </p>
      </div>
    </aside>
  );
}
