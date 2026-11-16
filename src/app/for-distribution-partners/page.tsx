'use client';

import React from 'react';
import Link from 'next/link';
import { Share2, DollarSign, Download, ShieldCheck, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import { OneEditOnePageCallout } from '@/components/ui/AttributionNotice';

export default function ForDistributionPartnersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          For Social Page Owners & Publishers
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Monetize Your Audience With Finished, High-Quality Edits
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Own or manage a YouTube Shorts, Instagram Reels, or TikTok page? Receive paid publishing assignments with pre-approved, rights-cleared videos. Zero editing required.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-300">Strict Marketplace Policy: Distribution Partners Do Not Edit</div>
          <p className="text-amber-200/80 leading-relaxed">
            Distribution partners only receive approved finished videos. You publish the creative on the exact registered page assigned to you and submit the public post URL and evidence. Altering the creative or distributing the same video to unauthorized secondary pages is strictly prohibited.
          </p>
        </div>
      </div>

      {/* How it works for partners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-white">Register & Verify Pages</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Add your social profiles with niche, primary language, and pricing. Verify page ownership via official OAuth or temporary bio verification codes.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-white">Accept Paid Invitations</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Receive placement offers matched to your audience. Review compensation, brief instructions, and deadline, then accept with one click.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
            3
          </div>
          <h3 className="text-base font-bold text-white">Publish & Get Paid</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download the finalized asset via expiring secure link. Publish on your assigned channel and submit the live URL. Once verified, payout is released.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white">Why Distribution Partners Partner With Clipper</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Zero Video Editing:</strong> High-production clips produced by internal studio editors.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Full Rights Protection:</strong> 100% verified copyright declarations and commercial licensing.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Guaranteed Exclusivity:</strong> The assigned Edit ID will never be published on a competing page.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Reliable Payouts:</strong> Automated settlement directly to your connected bank via Stripe.</span>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Register your social channels today</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Start receiving paid invitations for YouTube Shorts, Instagram Reels, and TikTok.
        </p>
        <Link
          href="/partner/pages/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20"
        >
          <span>Add Your First Page</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
