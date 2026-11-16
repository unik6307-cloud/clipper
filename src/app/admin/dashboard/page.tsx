'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Users,
  Film,
  Lock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { OneEditOnePageCallout } from '@/components/ui/AttributionNotice';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/overview')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const kpis = data?.kpis || {};
  const recentLedger = data?.recentLedger || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Executive Operations Console</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
              Admin Governance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global marketplace telemetry: gross volume, platform revenues, partner liabilities, and 1:1 distribution integrity.
          </p>
        </div>
        <Link
          href="/admin/assignments"
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-colors"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>1:1 Integrity Operations</span>
        </Link>
      </div>

      <OneEditOnePageCallout />

      {/* Primary Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Gross Merchandise Value (GMV)</span>
          <div className="text-2xl font-mono font-bold text-white">
            ${((kpis.totalGmvCents || 0) / 100).toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-400">Total Billed Customer Orders</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Marketplace Fees Earned</span>
          <div className="text-2xl font-mono font-bold text-brand-400">
            ${((kpis.platformFeesEarnedCents || 0) / 100).toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">10% Platform Commission</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Editing Studio Revenue</span>
          <div className="text-2xl font-mono font-bold text-cyan-400">
            ${((kpis.editingRevenueCents || 0) / 100).toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Internal Production Fees</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Eligible Partner Payables</span>
          <div className="text-2xl font-mono font-bold text-indigo-400">
            ${((kpis.eligiblePayablesCents || 0) / 100).toFixed(2)}
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">Verified Live — Ready for Batch</span>
        </div>
      </div>

      {/* Operational Throughput KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Active Creators</span>
          <div className="text-xl font-mono font-bold text-white mt-1">{kpis.creatorsCount || 0}</div>
          <span className="text-[10px] text-slate-500">Acme & Media Brands</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Verified Social Pages</span>
          <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
            {kpis.verifiedPagesCount || 0} / {kpis.pagesCount || 0}
          </div>
          <span className="text-[10px] text-slate-500">API & Bio Code Verified</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Approved Final Edits</span>
          <div className="text-xl font-mono font-bold text-brand-400 mt-1">{kpis.finalEditsCount || 0}</div>
          <span className="text-[10px] text-slate-500">Immutable Vault Records</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Dispute & Takedown Count</span>
          <div className="text-xl font-mono font-bold text-rose-400 mt-1">{kpis.disputesCount || 0}</div>
          <span className="text-[10px] text-slate-500">0.0% Dispute Rate</span>
        </div>
      </div>

      {/* Recent Ledger Entries */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Auditable Financial Ledger Movements
          </span>
          <Link href="/admin/finance" className="text-brand-400 hover:underline">
            View Full Ledger
          </Link>
        </div>

        <div className="divide-y divide-slate-800">
          {recentLedger.map((row: any) => (
            <div key={row.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {row.transactionType}
                  </span>
                  <span className="text-slate-300">{row.notes}</span>
                </div>
                <div className="text-slate-500 text-[10px] font-mono">Account: {row.accountId}</div>
              </div>

              <div className="text-right font-mono text-[11px]">
                {row.debitCents > 0 && <span className="text-emerald-400 font-bold">+${(row.debitCents / 100).toFixed(2)}</span>}
                {row.creditCents > 0 && <span className="text-indigo-400 font-bold">-${(row.creditCents / 100).toFixed(2)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
