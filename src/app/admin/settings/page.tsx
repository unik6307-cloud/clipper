'use client';

import React, { useState } from 'react';
import { Sliders, ShieldCheck, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';
import { DEFAULT_WEIGHTS, ScoringWeights } from '@/lib/ai-matching';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [editingPrice, setEditingPrice] = useState(120);
  const [commissionRate, setCommissionRate] = useState(10);
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);

  const sumWeights =
    weights.nicheRelevance +
    weights.medianViews +
    weights.audienceFit +
    weights.budgetFit +
    weights.recentActivity +
    weights.deliveryHistory +
    weights.verification;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Economics & AI Configuration</h1>
        <p className="text-slate-400 mt-1">
          Configure marketplace commission, editing unit economics, and 7-factor AI matching engine weights.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Platform configurations updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Marketplace Economics */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Marketplace Economics & Fees</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Base Internal Video Editing Fee ($ USD / clip)
              </label>
              <input
                type="number"
                min="50"
                max="500"
                value={editingPrice}
                onChange={(e) => setEditingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Standard baseline fee for 9:16 re-framing, hook selection, and subtitles.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Marketplace Commission Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Platform fee applied to unbundled creator campaign quotes.
              </span>
            </div>
          </div>
        </div>

        {/* AI Scoring Engine Weights */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>AI Page Recommendation Scoring Model (Total: {sumWeights}%)</span>
            </div>
            <span
              className={`font-mono text-xs font-bold ${
                sumWeights === 100 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              Sum: {sumWeights}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Niche & Content Relevance ({weights.nicheRelevance}%)
              </label>
              <input
                type="number"
                value={weights.nicheRelevance}
                onChange={(e) => setWeights({ ...weights, nicheRelevance: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Median Views & Consistency ({weights.medianViews}%)
              </label>
              <input
                type="number"
                value={weights.medianViews}
                onChange={(e) => setWeights({ ...weights, medianViews: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Audience Compatibility ({weights.audienceFit}%)
              </label>
              <input
                type="number"
                value={weights.audienceFit}
                onChange={(e) => setWeights({ ...weights, audienceFit: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Budget & Price Fit ({weights.budgetFit}%)
              </label>
              <input
                type="number"
                value={weights.budgetFit}
                onChange={(e) => setWeights({ ...weights, budgetFit: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Cadence & Recent Activity ({weights.recentActivity}%)
              </label>
              <input
                type="number"
                value={weights.recentActivity}
                onChange={(e) => setWeights({ ...weights, recentActivity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Historical Delivery Reliability ({weights.deliveryHistory}%)
              </label>
              <input
                type="number"
                value={weights.deliveryHistory}
                onChange={(e) => setWeights({ ...weights, deliveryHistory: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Verification Completeness ({weights.verification}%)
              </label>
              <input
                type="number"
                value={weights.verification}
                onChange={(e) => setWeights({ ...weights, verification: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition-colors"
        >
          Save Platform Settings
        </button>
      </form>
    </div>
  );
}
