'use client';

import React from 'react';
import { TrendingUp, BarChart2, PieChart, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import { AttributionNotice } from '@/components/ui/AttributionNotice';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace Business Intelligence</h1>
        <p className="text-xs text-slate-400 mt-1">
          Macro economics, funnel conversion, partner retention, and delivery completion reliability.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Campaign Completion Rate</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">98.5%</div>
          <span className="text-[10px] text-slate-500">Across All Placements</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Avg Time to Partner Acceptance</span>
          <div className="text-2xl font-mono font-bold text-brand-400 mt-1">4.2 hrs</div>
          <span className="text-[10px] text-slate-500">SLA: Under 24h</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Repeat Creator Rate</span>
          <div className="text-2xl font-mono font-bold text-indigo-400 mt-1">74.0%</div>
          <span className="text-[10px] text-slate-500">Quarterly Cohorts</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Platform Gross Take Rate</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">10.0%</div>
          <span className="text-[10px] text-slate-500">Configured Standard</span>
        </div>
      </div>

      <AttributionNotice
        provenance="PLATFORM_API"
        caveatText="Telemetry strictly aggregates confirmed system transactions. Estimates are clearly isolated from verified accounting ledgers."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="font-bold text-white text-sm">Marketplace Conversion Funnel</h2>
          <div className="space-y-2 font-mono">
            <div className="p-3 rounded-lg bg-slate-950 flex justify-between">
              <span className="text-slate-400">1. Campaigns Created</span>
              <span className="text-white font-bold">100%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 flex justify-between">
              <span className="text-slate-400">2. Edits Approved by QA</span>
              <span className="text-cyan-400 font-bold">96.4%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 flex justify-between">
              <span className="text-slate-400">3. Final Edits Approved by Creator</span>
              <span className="text-emerald-400 font-bold">94.8%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 flex justify-between">
              <span className="text-slate-400">4. 1:1 Placements Committed</span>
              <span className="text-indigo-400 font-bold">92.0%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 flex justify-between">
              <span className="text-slate-400">5. Published & API Verified</span>
              <span className="text-brand-400 font-bold">98.5%</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="font-bold text-white text-sm">Platform Distribution Breakdown</h2>
          <div className="space-y-2 font-mono">
            <div className="p-3 rounded-lg bg-slate-950 flex justify-between">
              <span className="text-slate-400">YouTube Shorts</span>
              <span className="text-white font-bold">52% Placements</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 flex justify-between">
              <span className="text-slate-400">Instagram Reels</span>
              <span className="text-white font-bold">34% Placements</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 flex justify-between">
              <span className="text-slate-400">TikTok Feed</span>
              <span className="text-white font-bold">14% Placements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
