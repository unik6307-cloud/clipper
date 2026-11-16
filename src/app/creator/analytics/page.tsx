'use client';

import React, { useState } from 'react';
import { BarChart3, Download, Eye, Heart, MessageCircle, Share2, TrendingUp, Calendar } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/StatusPill';
import { AttributionNotice } from '@/components/ui/AttributionNotice';

export default function CreatorAnalyticsPage() {
  const [dateFilter, setDateFilter] = useState('30d');

  const analyticsData = [
    {
      editId: 'EDIT-ACME-001',
      title: 'Clip 1: The $100M GPU Cluster Mistake',
      page: '@TechSparksOfficial',
      platform: 'YOUTUBE',
      views: 18450,
      likes: 1240,
      comments: 89,
      shares: 312,
      cpm: 9.75,
      spend: 180.0,
      provenance: 'PLATFORM_API',
      publishedAt: '2026-11-14',
    },
    {
      editId: 'EDIT-ACME-002',
      title: 'Clip 2: Local LLMs in 2026 Enterprise',
      page: '@codedaily.reels',
      platform: 'INSTAGRAM',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      cpm: 0,
      spend: 150.0,
      provenance: 'PARTNER_SUBMITTED',
      publishedAt: 'Publishing Due Soon',
    },
  ];

  const handleExportCsv = () => {
    const headers = 'Edit ID,Title,Page Handle,Platform,Observed Views,Likes,Comments,Shares,Effective CPM,Spend,Provenance\n';
    const rows = analyticsData
      .map(
        (r) =>
          `"${r.editId}","${r.title}","${r.page}","${r.platform}",${r.views},${r.likes},${r.comments},${r.shares},${r.cpm},${r.spend},"${r.provenance}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipper_analytics_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Campaign Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audited performance data per individual Edit ID and assigned destination channel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-400">
            {['7d', '30d', '90d', 'ALL'].map((tab) => (
              <button
                key={tab}
                onClick={() => setDateFilter(tab)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  dateFilter === tab ? 'bg-brand-600 text-white font-medium' : 'hover:text-slate-200'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Observed Total Views</div>
          <div className="text-2xl font-mono font-bold text-white mt-1">18,450</div>
          <div className="text-[10px] text-emerald-400 mt-1">API Verified Organic</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Avg Effective CPM</div>
          <div className="text-2xl font-mono font-bold text-brand-400 mt-1">$9.75</div>
          <div className="text-[10px] text-slate-500 mt-1">Cost / 1,000 Views</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Engagements</div>
          <div className="text-2xl font-mono font-bold text-indigo-400 mt-1">1,641</div>
          <div className="text-[10px] text-slate-500 mt-1">8.8% Engagement Rate</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Active Placements</div>
          <div className="text-2xl font-mono font-bold text-white mt-1">2</div>
          <div className="text-[10px] text-slate-500 mt-1">Strict 1:1 Channels</div>
        </div>
      </div>

      <AttributionNotice
        provenance="PLATFORM_API"
        caveatText="Performance figures represent public post analytics observed over stated windows. Data is never pooled from unrelated accounts."
      />

      {/* Breakdown Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-white uppercase tracking-wider">
          Per-Edit Performance & Attribution Table
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-3.5">Edit ID</th>
                <th className="p-3.5">Destination Page</th>
                <th className="p-3.5">Platform</th>
                <th className="p-3.5 text-right">Views</th>
                <th className="p-3.5 text-right">Likes</th>
                <th className="p-3.5 text-right">Effective CPM</th>
                <th className="p-3.5">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {analyticsData.map((row) => (
                <tr key={row.editId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono text-white font-semibold">{row.editId}</td>
                  <td className="p-3.5 font-mono text-brand-300">{row.page}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-400">{row.platform}</td>
                  <td className="p-3.5 font-mono text-right font-bold text-white">
                    {row.views > 0 ? row.views.toLocaleString() : 'Pending'}
                  </td>
                  <td className="p-3.5 font-mono text-right">{row.likes > 0 ? row.likes.toLocaleString() : '—'}</td>
                  <td className="p-3.5 font-mono text-right text-emerald-400 font-bold">
                    {row.cpm > 0 ? `$${row.cpm.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-3.5">
                    <VerificationBadge level={row.provenance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
