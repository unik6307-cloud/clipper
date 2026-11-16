'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, PlusCircle, ArrowRight, Clock, ShieldCheck, Lock } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function CreatorCampaignsListPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.campaigns || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = campaigns.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Campaign Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your long-form production orders and one-to-one distribution pipelines.
          </p>
        </div>
        <Link
          href="/creator/campaigns/new"
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs overflow-x-auto pb-1">
        {['ALL', 'DISTRIBUTION_IN_PROGRESS', 'READY_FOR_DISTRIBUTION', 'PAID', 'COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              filter === f
                ? 'bg-brand-600/20 border-brand-500 text-brand-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f === 'ALL' ? 'All Campaigns' : f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading campaign records...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Film className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No campaigns found</h3>
          <p className="text-xs text-slate-400">Launch your first campaign to convert raw footage into short edits.</p>
          <Link
            href="/creator/campaigns/new"
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold text-xs"
          >
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((cmp) => (
            <div
              key={cmp.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">#{cmp.id.slice(-6)}</span>
                    <h2 className="text-base font-bold text-white">{cmp.title}</h2>
                    <StatusPill status={cmp.status} />
                  </div>
                  <div className="text-xs text-slate-400">
                    Niche: {cmp.contentNiche} • Target Platforms: {cmp.targetPlatforms}
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-white font-bold">${(cmp.totalBudgetCents / 100).toFixed(2)}</div>
                  <div className="text-slate-500 text-[10px]">Total Budget</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Edits Requested</span>
                  <span className="font-mono text-white font-bold">{cmp.desiredEditsCount} Clips</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Approved Final Edits</span>
                  <span className="font-mono text-brand-400 font-bold">{cmp.finalEdits?.length || 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">1:1 Locked Placements</span>
                  <span className="font-mono text-indigo-400 font-bold">
                    {cmp.finalEdits?.filter((e: any) => e.assignment)?.length || 0}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">Rights Cleared</span>
                  <span className="font-mono text-emerald-400 font-bold">Verified</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 text-xs">
                <div className="text-slate-400 text-[11px]">
                  Created {new Date(cmp.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/creator/studio"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
                  >
                    Review Studio
                  </Link>
                  <Link
                    href="/creator/discover"
                    className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium flex items-center gap-1"
                  >
                    <span>Match Pages</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
