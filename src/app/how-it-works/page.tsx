'use client';

import React from 'react';
import Link from 'next/link';
import {
  Upload,
  Shield,
  Scissors,
  CheckCircle2,
  Sparkles,
  Lock,
  Download,
  Send,
  BarChart3,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { OneEditOnePageCallout, AttributionNotice } from '@/components/ui/AttributionNotice';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      icon: Upload,
      title: 'Creator Uploads Raw Source Video',
      actor: 'Content Creator',
      desc: 'Upload full-length podcasts, presentations, or tutorials via secure multipart signed S3 upload. The file binary is stored in private object storage, not application servers.',
      rule: 'File metadata, SHA-256 hash, and format are registered in the asset vault.',
    },
    {
      num: '02',
      icon: Shield,
      title: 'Rights & Licensing Declaration',
      actor: 'Content Creator & Legal Engine',
      desc: 'Creator certifies full ownership or commercial licensing of the source content, audio sync rights, permitted territories, and allowed platforms before any editing begins.',
      rule: 'NON-NEGOTIABLE: Editing is blocked if rights declarations are missing or rejected.',
    },
    {
      num: '03',
      icon: Scissors,
      title: 'Internal Studio Editing & QA Checklist',
      actor: 'Platform Production Team',
      desc: 'Internal video editors craft standalone 30–60s clips optimized for mobile. Lead QA reviewers verify -14 LUFS audio loudness, 9:16 aspect ratio, hook quality, and subtitle accuracy.',
      rule: 'Distribution partners never edit videos; internal staff controls creative quality.',
    },
    {
      num: '04',
      icon: CheckCircle2,
      title: 'Creator Approval & Immutable Edit ID',
      actor: 'Creator & System Vault',
      desc: 'Creator previews draft versions in the Studio and approves the final cut. The platform generates an opaque, immutable Edit ID (e.g. EDIT-ACME-001) with cryptographic hash and rights snapshot.',
      rule: 'Once approved, the creative is frozen. No stealth revisions or duplicate cloning.',
    },
    {
      num: '05',
      icon: Sparkles,
      title: '7-Factor AI Page Recommendation',
      actor: 'Deterministic AI Matching Engine',
      desc: 'Our scoring engine ranks verified partner pages based on Niche Relevance (25%), Median Views (20%), Audience Fit (15%), Price Fit (15%), Cadence (10%), Reliability (10%), and Verification (5%).',
      rule: 'Full transparency: Creators see fit breakdowns, missing data caveats, and exclusion notes.',
    },
    {
      num: '06',
      icon: Lock,
      title: '1-to-1 Distribution Assignment Lock',
      actor: 'Creator & Transaction Engine',
      desc: 'Creator selects one destination page for the Edit ID. The system executes a database transaction with a unique constraint on distribution_assignments.finalEditId.',
      rule: 'NON-NEGOTIABLE: A committed Edit ID can never be assigned to a second page.',
    },
    {
      num: '07',
      icon: Download,
      title: 'Partner Acceptance & Expiring Download',
      actor: 'Distribution Partner',
      desc: 'Selected partner receives campaign invitation with compensation and deadline. Upon acceptance, an access-controlled 15-minute expiring download URL is issued.',
      rule: 'Partner must publish the exact approved video without altering creative or subtitles.',
    },
    {
      num: '08',
      icon: Send,
      title: 'Public URL Submission & Platform Verification',
      actor: 'Partner, Social Adapter & QA',
      desc: 'Partner submits public live post URL. Official API adapter validates domain and channel ownership. If API verification is unavailable, QA reviews proof screenshots.',
      rule: 'Never marked verified solely because partner clicks submit. Genuine verification required.',
    },
    {
      num: '09',
      icon: DollarSign,
      title: 'Audit Provenance & Payout Settlement',
      actor: 'Finance & Marketplace Provider',
      desc: 'Post metrics are recorded with clear provenance tags and attribution disclaimers. Partner payout is marked ELIGIBLE and disbursed via Stripe Connect or marketplace settlement.',
      rule: 'Double-entry ledger tracks charges, platform fees, and partner payables.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
          Architecture & Operational Blueprint
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          How The Clipper Engine Works
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          The step-by-step lifecycle from raw video upload to verified 1:1 publication and settlement.
        </p>
      </div>

      <OneEditOnePageCallout />

      {/* Step by Step Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-7 before:w-0.5 before:bg-slate-800 before:z-0">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="relative z-10 flex items-start gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-brand-400 font-bold group-hover:border-brand-500 transition-colors shadow-lg">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-400">{s.num}</span>
                    <h3 className="text-base font-bold text-white">{s.title}</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {s.actor}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-slate-200">Enforcement: </strong>
                  {s.rule}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AttributionNotice />

      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Experience the platform in action</h2>
        <div className="flex justify-center gap-4">
          <Link
            href="/creator/dashboard"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md"
          >
            Creator Dashboard
          </Link>
          <Link
            href="/partner/dashboard"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md"
          >
            Partner Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
