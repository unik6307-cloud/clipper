'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Video, Users, Sparkles, Target, Award } from 'lucide-react';
import { OneEditOnePageCallout } from '@/components/ui/AttributionNotice';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
          Company & Mission
        </span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Restoring Integrity to Short-Form Video Distribution
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          The modern internet is flooded with generic repost bots, content scrapers, and spam networks that blast identical video copies across hundreds of low-tier accounts. We built Clipper to provide a professional, sustainable alternative.
        </p>
      </div>

      <OneEditOnePageCallout />

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-white">Our Core Philosophy</h2>
        <p>
          We believe long-form content creators—podcasters, educators, technical founders, and streamers—deserve high-craft editing tailored specifically to mobile attention spans. But great editing is useless if it is dumped into the algorithmic void or spammed identically across thirty accounts.
        </p>
        <p>
          By enforcing the <strong>ONE_EDIT_ONE_PAGE</strong> rule in our software architecture, each finished video edit is treated as a unique, exclusive asset. A creator reaches new, authentic audiences through verified channel partners, while channel owners receive legitimate, rights-cleared, high-retention video content that enriches their community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <Target className="w-5 h-5 text-brand-400" />
          <h3 className="font-bold text-white text-sm">Human Craftsmanship</h3>
          <p className="text-xs text-slate-400">
            Internal video editors select narrative hooks, subtitles, and pacing. No fully-automated hallucinated AI cutdowns.
          </p>
        </div>
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <h3 className="font-bold text-white text-sm">AI Recommendation</h3>
          <p className="text-xs text-slate-400">
            Algorithms assist with channel discovery, audience demographic fit, and price comparison, without bypassing creator human approval.
          </p>
        </div>
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white text-sm">Audited Transparency</h3>
          <p className="text-xs text-slate-400">
            Every view, engagement rate, and delivery record is paired with its verifiable data provenance.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="font-bold text-white text-sm">Have questions or want to partner?</div>
          <div className="text-xs text-slate-400">Our operations team responds to inquiries within one business day.</div>
        </div>
        <Link
          href="/contact"
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
        >
          Contact Team
        </Link>
      </div>
    </div>
  );
}
