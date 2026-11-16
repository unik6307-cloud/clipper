'use client';

import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Clock, AlertCircle, Download, ShieldCheck } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function PartnerEarningsPage() {
  const payouts = [
    {
      id: 'payout_asg_001',
      editId: 'EDIT-ACME-001',
      page: '@TechSparksOfficial',
      amount: 180.0,
      status: 'ELIGIBLE',
      date: '2026-11-15',
      note: 'Verified published on YouTube Shorts. In queue for automated weekly batch settlement.',
    },
    {
      id: 'payout_past_092',
      editId: 'EDIT-PREV-092',
      page: '@TechSparksOfficial',
      amount: 220.0,
      status: 'PAID',
      date: '2026-11-01',
      note: 'Disbursed via Stripe Marketplace payout batch BATCH-8921.',
    },
    {
      id: 'payout_past_088',
      editId: 'EDIT-PREV-088',
      page: '@codedaily.reels',
      amount: 150.0,
      status: 'PAID',
      date: '2026-10-24',
      note: 'Disbursed via Stripe Marketplace payout batch BATCH-8812.',
    },
  ];

  const eligibleTotal = payouts
    .filter((p) => p.status === 'ELIGIBLE')
    .reduce((a, b) => a + b.amount, 0);

  const paidTotal = payouts
    .filter((p) => p.status === 'PAID')
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Earnings & Payout Settlements</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track eligible placement earnings, payout batches, and Stripe connected account balance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Eligible For Next Payout</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            ${eligibleTotal.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500">Verified & QA Cleared</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Settled & Paid</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            ${paidTotal.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-400">Bank Transfer Complete</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Payout Method</span>
          <div className="text-sm font-semibold text-slate-100 mt-1">Stripe Connected Express</div>
          <span className="text-[10px] text-slate-500">W-9 Tax Verified</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            Connected Account <strong className="text-white font-mono">acct_1NZ4920492849203</strong> is in good standing.
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">Payout Frequency: Weekly (Tuesdays)</span>
      </div>

      {/* Payout History Ledger */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-white uppercase tracking-wider">
          Partner Settlement History
        </div>
        <div className="divide-y divide-slate-800 text-xs">
          {payouts.map((row) => (
            <div key={row.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">{row.editId}</span>
                  <span className="font-mono text-xs text-brand-300">{row.page}</span>
                  <StatusPill status={row.status} />
                </div>
                <div className="text-slate-400 text-[11px]">{row.note}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-base font-mono font-bold text-emerald-400">${row.amount.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-500">{row.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
