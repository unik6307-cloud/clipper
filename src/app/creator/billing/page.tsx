'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Download, CheckCircle2, FileText, DollarSign } from 'lucide-react';

export default function CreatorBillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        const invList: any[] = [];
        data.campaigns?.forEach((c: any) => {
          c.quotes?.forEach((q: any) => {
            invList.push({
              id: q.id,
              campaignTitle: c.title,
              editingSubtotal: q.editingSubtotalCents,
              placementSubtotal: q.placementSubtotalCents,
              platformFee: q.platformFeeCents,
              totalDue: q.totalDueCents,
              status: q.status,
              date: q.createdAt,
            });
          });
        });
        setInvoices(invList);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Invoices</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review transparent, unbundled campaign quotes, receipts, and payment transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Billed to Date</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">$913.00</div>
          <span className="text-[10px] text-emerald-400">Paid in Full</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Editing Subtotals</span>
          <div className="text-2xl font-mono font-bold text-brand-400 mt-1">$360.00</div>
          <span className="text-[10px] text-slate-500">Internal Studio Fees</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Distribution Placements</span>
          <div className="text-2xl font-mono font-bold text-indigo-400 mt-1">$470.00</div>
          <span className="text-[10px] text-slate-500">100% Partner Payouts</span>
        </div>
      </div>

      {/* Invoices List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-white uppercase tracking-wider">
          Transaction Records & Quotes
        </div>
        <div className="divide-y divide-slate-800 text-xs">
          {invoices.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Loading invoice ledger...</div>
          ) : (
            invoices.map((inv) => (
              <div key={inv.id} className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">QUOTE-{inv.id.slice(-6).toUpperCase()}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      PAID
                    </span>
                  </div>
                  <div className="text-slate-300 font-medium">{inv.campaignTitle}</div>
                  <div className="text-slate-500 text-[11px] font-mono">
                    Editing: ${(inv.editingSubtotal / 100).toFixed(2)} • Placements: ${(inv.placementSubtotal / 100).toFixed(2)} • Fee: ${(inv.platformFee / 100).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-base font-mono font-bold text-white">${(inv.totalDue / 100).toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500">{new Date(inv.date).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => alert('Download itemized tax receipt PDF')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Download Receipt"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
