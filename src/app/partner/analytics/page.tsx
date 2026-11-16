'use client';

import React from 'react';
import { BarChart3, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/StatusPill';
import { AttributionNotice } from '@/components/ui/AttributionNotice';

export default function PartnerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Channel & Post Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review permitted post performance and verified audience reach across your connected channels.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Verified Placements</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">12</div>
          <span className="text-[10px] text-emerald-400">100% Delivery Success</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Average Views Per Clip</span>
          <div className="text-2xl font-mono font-bold text-brand-400 mt-1">31,400</div>
          <span className="text-[10px] text-slate-500">Median Sampled (20 posts)</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Historical Completion Rate</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">99.2%</div>
          <span className="text-[10px] text-slate-500">Tier 1 Reliability</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Dispute Rate</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">0.0%</div>
          <span className="text-[10px] text-emerald-400">Zero Flags</span>
        </div>
      </div>

      <AttributionNotice
        provenance="PLATFORM_API"
        caveatText="Channel analytics are collected via official platform APIs in read-only mode. Metrics are not extrapolated or shared with unapproved third parties."
      />

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Recent Verified Placement Performance</h2>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white">EDIT-ACME-001</span>
              <span className="font-mono text-brand-300">@TechSparksOfficial</span>
              <VerificationBadge level="API_VERIFIED" />
            </div>
            <div className="text-slate-400 text-[11px]">YouTube Shorts • Published 24h ago</div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-right">
            <div>
              <span className="text-slate-500 text-[10px] block">Views</span>
              <span className="font-mono font-bold text-white text-sm">18,450</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Likes</span>
              <span className="font-mono font-bold text-white text-sm">1,240</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Comments</span>
              <span className="font-mono font-bold text-white text-sm">89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
