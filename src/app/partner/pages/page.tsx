'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Share2, PlusCircle, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/StatusPill';

export default function PartnerPagesListPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/partner/pages')
      .then((res) => res.json())
      .then((data) => {
        setPages(data.pages || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Registered Social Pages</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your verified publishing accounts, placement pricing, and category allowances.
          </p>
        </div>
        <Link
          href="/partner/pages/new"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Register New Channel</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading social page profiles...</div>
      ) : pages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Share2 className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No social pages registered</h3>
          <p className="text-xs text-slate-400">Add your YouTube Shorts, Instagram, or TikTok channels to receive invitations.</p>
          <Link
            href="/partner/pages/new"
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
          >
            Add Channel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base text-white">{p.pageName}</span>
                    <span className="font-mono text-xs text-brand-300 font-semibold">{p.handle}</span>
                    <VerificationBadge level={p.verificationLevel} provenance={p.metricProvenance} />
                  </div>
                  <a
                    href={p.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mt-1 font-mono"
                  >
                    <span>{p.profileUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {p.platform}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Placement Rate</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ${(p.placementPriceCents / 100).toFixed(2)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Median Views</span>
                  <span className="font-mono font-bold text-white">
                    {p.medianViews.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Cadence</span>
                  <span className="font-mono font-bold text-slate-300">
                    {p.postingFrequency}/week
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Niche: {p.niche}</span>
                <span>Markets: {p.audienceMarkets}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
