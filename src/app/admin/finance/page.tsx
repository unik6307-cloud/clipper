'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, Clock, Play, FileText, ArrowRight } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function AdminFinancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchMsg, setBatchMsg] = useState<string | null>(null);

  const loadFinance = () => {
    fetch('/api/admin/finance')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadFinance();
  }, []);

  const handleProcessEligiblePayouts = async () => {
    const eligiblePayouts = data?.payouts?.filter((p: any) => p.status === 'ELIGIBLE') || [];
    if (eligiblePayouts.length === 0) {
      alert('No eligible payouts awaiting settlement.');
      return;
    }

    setBatchLoading(true);
    setBatchMsg(null);

    try {
      const payoutIds = eligiblePayouts.map((p: any) => p.id);
      const res = await fetch('/api/admin/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PROCESS_PAYOUT_BATCH', payoutIds }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error);

      setBatchMsg(resData.message);
      loadFinance();
    } catch (err: any) {
      setBatchMsg(`Error: ${err.message}`);
    } finally {
      setBatchLoading(false);
    }
  };

  const payouts = data?.payouts || [];
  const ledgerEntries = data?.ledgerEntries || [];
  const quotes = data?.quotes || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace Finance & Settlements</h1>
          <p className="text-xs text-slate-400 mt-1">
            Double-entry ledger movements, customer invoice receipts, and partner payout batch processing.
          </p>
        </div>
        <button
          disabled={batchLoading}
          onClick={handleProcessEligiblePayouts}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 disabled:opacity-50 transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{batchLoading ? 'Processing Batch...' : 'Disburse Eligible Partner Payouts'}</span>
        </button>
      </div>

      {batchMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{batchMsg}</span>
        </div>
      )}

      {/* Partner Payables Queue */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Distribution Partner Payables Queue ({payouts.length})
          </span>
          <span className="text-slate-400 text-[11px]">Stripe Marketplace Connected Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-3.5">Payout ID</th>
                <th className="p-3.5">Partner Entity</th>
                <th className="p-3.5">Target Channel</th>
                <th className="p-3.5">Edit ID</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {payouts.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{p.id}</td>
                  <td className="p-3.5 font-semibold text-white">{p.partner?.businessName}</td>
                  <td className="p-3.5 font-mono text-brand-300">{p.assignment?.socialPage?.handle}</td>
                  <td className="p-3.5 font-mono text-white">{p.assignment?.finalEditId}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">
                    ${(p.amountCents / 100).toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Double Entry Ledger Entries */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 font-bold text-white uppercase tracking-wider text-[11px]">
          Audited Double-Entry Ledger ({ledgerEntries.length} Records)
        </div>

        <div className="divide-y divide-slate-800">
          {ledgerEntries.map((ledg: any) => (
            <div key={ledg.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {ledg.transactionType}
                  </span>
                  <span className="text-slate-200">{ledg.notes}</span>
                </div>
                <div className="text-slate-500 text-[10px] font-mono">
                  Account Ref: {ledg.accountId} • Created {new Date(ledg.createdAt).toLocaleTimeString()}
                </div>
              </div>

              <div className="text-right font-mono text-[11px]">
                {ledg.debitCents > 0 && <span className="text-emerald-400 font-bold">+${(ledg.debitCents / 100).toFixed(2)}</span>}
                {ledg.creditCents > 0 && <span className="text-indigo-400 font-bold">-${(ledg.creditCents / 100).toFixed(2)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
