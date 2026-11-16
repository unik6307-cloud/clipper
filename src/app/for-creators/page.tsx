'use client';

import React from 'react';
import Link from 'next/link';
import { Video, ShieldCheck, CheckCircle2, Lock, ArrowRight, Sparkles, BarChart3, Scissors } from 'lucide-react';
import { OneEditOnePageCallout, AttributionNotice } from '@/components/ui/AttributionNotice';

export default function ForCreatorsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
          For Content Creators & Media Brands
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Turn Raw Long-Form Video Into Verified 1:1 Social Reach
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Stop wasting hours re-editing podcasts or relying on low-trust mass-reposting. Our internal studio turns your footage into bespoke short clips and places each one on a dedicated, verified social page.
        </p>
      </div>

      <OneEditOnePageCallout />

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
            <Scissors className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">1. Internal Production Team</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Distribution partners never edit your video. Professional editors select the most engaging hooks, format for 9:16 vertical video, add synchronized kinetic subtitles, and normalize audio to -14 LUFS standards.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">2. Guaranteed One-Edit-One-Page</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every creative is assigned an opaque, immutable Edit ID (e.g. EDIT-ACME-001) backed by a SHA-256 checksum and a strict database unique constraint. The exact same creative will never appear on another page.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">3. 7-Factor AI Page Discovery</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our recommendation engine matches your edit against verified pages based on niche relevance (25%), median view history (20%), audience geography (15%), placement budget fit (15%), posting frequency (10%), and delivery reliability (10%).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">4. Authentic Performance Tracking</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We provide official API and reviewer-verified metrics. No fabricated bot vanity stats or speculative extrapolations. Every metric snapshot displays its source, date, sample size, and attribution caveat.
          </p>
        </div>
      </div>

      <AttributionNotice />

      <div className="p-8 rounded-2xl bg-gradient-to-r from-brand-950 via-slate-900 to-slate-900 border border-brand-500/30 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Ready to create your first campaign?</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Upload your long-form video, review your unbundled quote, and preview your edits in your personal Studio.
        </p>
        <Link
          href="/creator/campaigns/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/20"
        >
          <span>Launch Campaign Wizard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
