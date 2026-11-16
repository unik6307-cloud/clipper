'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, CheckCircle2, ArrowRight, Calculator, ShieldCheck } from 'lucide-react';
import { OneEditOnePageCallout } from '@/components/ui/AttributionNotice';

export default function PricingPage() {
  const [clipsCount, setClipsCount] = useState(3);
  const [avgPlacementTier, setAvgPlacementTier] = useState(150); // $150 per placement avg

  const perClipEditing = 120; // $120.00
  const editingSubtotal = clipsCount * perClipEditing;
  const placementSubtotal = clipsCount * avgPlacementTier;
  const platformFee = Math.round((editingSubtotal + placementSubtotal) * 0.1); // 10%
  const total = editingSubtotal + placementSubtotal + platformFee;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
          Transparent Marketplace Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Unbundled Editing & Distribution Quotes
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          No hidden retainers or confusing packages. Production editing and distribution placements are quoted separately, so you only pay for what you approve.
        </p>
      </div>

      <OneEditOnePageCallout />

      {/* Interactive Live Quote Calculator */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-bold text-white">Live Campaign Quote Estimator</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                <span>Number of Unique Vertical Edits</span>
                <span className="font-mono text-brand-400 font-bold">{clipsCount} Edits</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={clipsCount}
                onChange={(e) => setClipsCount(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>1 clip</span>
                <span>5 clips</span>
                <span>10 clips</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                <span>Average Placement Rate (Per Page)</span>
                <span className="font-mono text-indigo-400 font-bold">${avgPlacementTier} / Page</span>
              </div>
              <input
                type="range"
                min="100"
                max="400"
                step="25"
                value={avgPlacementTier}
                onChange={(e) => setAvgPlacementTier(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>$100 (Micro)</span>
                <span>$200 (Mid-tier)</span>
                <span>$400 (Top-tier)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div>• Internal production fee: $120.00 per finished, QA-cleared 9:16 edit.</div>
            <div>• Placement budget: 100% disbursed to accepting verified distribution partners.</div>
            <div>• Marketplace fee: 10% platform commission covering verification & escrow.</div>
          </div>
        </div>

        {/* Itemized Breakdown Card */}
        <div className="md:col-span-5 p-6 rounded-xl bg-slate-950 border border-brand-500/30 space-y-4">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            Itemized Quote Breakdown
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Internal Video Editing ({clipsCount}x)</span>
              <span className="font-mono text-white font-semibold">${editingSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Distribution Placements ({clipsCount}x Pages)</span>
              <span className="font-mono text-white font-semibold">${placementSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Platform Service Commission (10%)</span>
              <span className="font-mono text-white font-semibold">${platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Estimated Taxes</span>
              <span className="font-mono">$0.00</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-white">Estimated Total</span>
            <span className="text-2xl font-mono font-extrabold text-brand-400">${total.toFixed(2)}</span>
          </div>

          <Link
            href="/creator/campaigns/new"
            className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs text-center block transition-colors shadow-md"
          >
            Create Campaign With This Scope
          </Link>
        </div>
      </div>

      {/* Pricing Policy Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="font-bold text-white">Pay Only For Approved Edits</div>
          <p className="text-slate-400 leading-relaxed">
            If our internal editors cannot produce a clip that meets your standards after requested revisions, placement funds are fully returned.
          </p>
        </div>
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="font-bold text-white">No Guaranteed Views Claims</div>
          <p className="text-slate-400 leading-relaxed">
            We never sell fake view packages or bot traffic. Pricing is strictly based on creative production and authentic partner placement fees.
          </p>
        </div>
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="font-bold text-white">Partner Payout Protection</div>
          <p className="text-slate-400 leading-relaxed">
            Distribution partners are guaranteed payout release as soon as public URL verification clears QA inspection.
          </p>
        </div>
      </div>
    </div>
  );
}
