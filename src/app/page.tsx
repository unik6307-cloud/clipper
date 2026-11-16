'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  Scissors,
  Share2,
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  TrendingUp,
  BarChart2,
  Users,
  Eye,
  Zap,
} from 'lucide-react';
import { OneEditOnePageCallout } from '@/components/ui/AttributionNotice';

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-medium text-brand-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Managed Short-Form Production & One-to-One Distribution</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Turn long-form videos into high-impact shorts.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-300">
              Distributed to exactly one verified page.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The managed marketplace where content creators submit raw footage, our internal production team crafts unique vertical clips, and AI recommends verified social pages to publish each edit on <strong className="text-white">one dedicated channel</strong>.
          </p>

          {/* Core Rule Callout Banner */}
          <div className="max-w-2xl mx-auto">
            <OneEditOnePageCallout />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/creator/campaigns/new"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white font-semibold text-sm shadow-xl shadow-brand-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Creator Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/partner/pages/new"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Register as Distribution Partner</span>
            </Link>
          </div>

          {/* Quick Metrics & Transparency */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-white">1 : 1</div>
              <div className="text-xs text-slate-400 mt-1">Strict Single Distribution</div>
              <div className="text-[11px] text-brand-400 mt-2 font-mono">No Duplicate Spam</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-400 mt-1">Internal Managed Editing</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-mono">Full Rights Cleared</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-white">7-Factor</div>
              <div className="text-xs text-slate-400 mt-1">AI Matching Matrix</div>
              <div className="text-[11px] text-sky-400 mt-2 font-mono">Niche & Median Fit</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-white">Zero Fake</div>
              <div className="text-xs text-slate-400 mt-1">Transparent Analytics</div>
              <div className="text-[11px] text-purple-400 mt-2 font-mono">API & Audit Provenance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Simulator */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">End-to-End Pipeline</span>
            <h2 className="text-3xl font-bold text-white">How The Clipper Marketplace Works</h2>
            <p className="text-slate-400 text-sm">
              From long-form podcast or tutorial upload to single-page publication and verified payout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step navigation tabs */}
            <div className="lg:col-span-5 space-y-3">
              {[
                {
                  step: 1,
                  title: '1. Creator Uploads & Clears Rights',
                  desc: 'Submit source video, define target audience, and sign the commercial distribution licence.',
                  badge: 'Direct Object Storage',
                },
                {
                  step: 2,
                  title: '2. Internal Production & QA Review',
                  desc: 'Our dedicated editors turn the video into high-hook 9:16 edits. QA verifies LUFS audio and captions.',
                  badge: 'Creator Approves Final',
                },
                {
                  step: 3,
                  title: '3. Immutable Edit ID Generated',
                  desc: 'Approval generates EDIT-XXXX with SHA-256 hash. Locked against duplicate distribution.',
                  badge: 'Cryptographic Checksum',
                },
                {
                  step: 4,
                  title: '4. AI Page Matching & 1:1 Lock',
                  desc: 'AI scores verified pages on niche, median views, and price fit. Creator picks one page; lock committed.',
                  badge: 'ONE_EDIT_ONE_PAGE',
                },
                {
                  step: 5,
                  title: '5. Partner Publishes & Submits URL',
                  desc: 'Partner downloads the creative (no editing permitted), publishes on their assigned channel, submits live URL.',
                  badge: 'Verified Payout',
                },
              ].map((item) => (
                <button
                  key={item.step}
                  onClick={() => setActiveStep(item.step)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeStep === item.step
                      ? 'bg-slate-900 border-brand-500/50 shadow-lg shadow-brand-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-100">{item.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-brand-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Interactive Preview Canvas */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 min-h-[420px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs text-slate-400 font-mono ml-2">Clipper Live Engine</span>
                  </div>
                  <span className="text-xs font-mono text-brand-400">Step {activeStep} of 5</span>
                </div>

                <div className="pt-6">
                  {activeStep === 1 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="text-xs font-semibold text-slate-300">Source Recording: ep42_founder_interview_4k.mp4</div>
                        <div className="text-xs text-slate-500 font-mono">Size: 2.48 GB • Duration: 52:00 • Format: MP4</div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-brand-500 h-full w-full" />
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                        <div className="font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Rights Declaration Verified</span>
                        </div>
                        <p className="text-emerald-400/80">
                          Worldwide, single-channel non-exclusive distribution licensed by creator.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <div className="text-xs font-semibold text-slate-200">Clip 1: $100M GPU Mistake</div>
                          <div className="text-[11px] text-slate-400 mt-1">Aspect: 9:16 • 42s • -14 LUFS Audio</div>
                          <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            QA Approved
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <div className="text-xs font-semibold text-slate-200">Clip 2: Local LLMs in 2026</div>
                          <div className="text-[11px] text-slate-400 mt-1">Aspect: 9:16 • 51s • Captions 100%</div>
                          <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            QA Approved
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 italic">
                        Internal team crafts edits. Distribution partners never touch raw footage or editing timelines.
                      </p>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-950 border border-brand-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Generated Immutable Edit ID</span>
                          <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            AUTHENTIC
                          </span>
                        </div>
                        <div className="text-lg font-mono font-bold text-white">EDIT-ACME-001</div>
                        <div className="text-[11px] font-mono text-slate-500 truncate">
                          SHA-256: a1b2c3d4e5f601728394a5b6c7d8e9f01234567890abcdef1234567890abcdef
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                        This creative is now an immutable asset token. Once assigned, no administrator or partner can reuse this Edit ID on another page.
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">Top Match: @TechSparks Shorts (YouTube)</div>
                          <div className="text-[11px] text-slate-400">34.2K Median Views • 99.2% Delivery Reliability</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-400">94.5% Match</div>
                          <div className="text-[11px] text-slate-400">$180.00 Placement</div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between opacity-70">
                        <div>
                          <div className="text-xs font-semibold text-white">Alternative: @codedaily.reels (Instagram)</div>
                          <div className="text-[11px] text-slate-400">26.8K Median Views • 5.1% Engagement</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-sky-400">91.2% Match</div>
                          <div className="text-[11px] text-slate-400">$150.00 Placement</div>
                        </div>
                      </div>
                      <div className="text-xs text-brand-300 font-semibold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Creator selects @TechSparks → Edit ID locked strictly 1:1 in database.</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 5 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Published URL (YouTube Shorts)</span>
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            API Verified
                          </span>
                        </div>
                        <div className="text-sm font-mono text-brand-300 break-all">
                          https://youtube.com/shorts/dQw4w9WgXcQ
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                          <div className="p-2 bg-slate-900 rounded">
                            <div className="font-bold text-white">18,450</div>
                            <div className="text-[10px] text-slate-500">Observed Views</div>
                          </div>
                          <div className="p-2 bg-slate-900 rounded">
                            <div className="font-bold text-white">1,240</div>
                            <div className="text-[10px] text-slate-500">Likes</div>
                          </div>
                          <div className="p-2 bg-slate-900 rounded">
                            <div className="font-bold text-emerald-400">$180.00</div>
                            <div className="text-[10px] text-slate-500">Partner Paid</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Attribution Note: Observed post performance snapshot. Not guaranteed incremental reach.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  disabled={activeStep <= 1}
                  onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white disabled:opacity-30"
                >
                  Previous
                </button>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeStep === i ? 'bg-brand-400 w-6' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <button
                  disabled={activeStep >= 5}
                  onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                  className="px-3 py-1.5 rounded text-xs text-brand-400 hover:text-brand-300 font-semibold disabled:opacity-30"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Marketplace Sides Section */}
      <section className="py-20 bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Marketplace Ecosystem</span>
            <h2 className="text-3xl font-bold text-white">Built for High-Trust Collaboration</h2>
            <p className="text-slate-400 text-sm">
              Clear responsibilities, audited handoffs, and non-negotiable boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Creator Side Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 hover:border-brand-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                  <Video className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Content Creators</h3>
                  <p className="text-xs text-slate-400">Podcasters, SaaS, Educators, Streamers</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Zero In-House Editing Headaches:</strong> Our vetted editors handle hooks, captions, pacing, and 9:16 vertical re-framing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Guaranteed 1:1 Distribution:</strong> Each finalized clip is sent to exactly ONE verified channel. Never recycled across secondary pages.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>AI Matching Matrix:</strong> Compare candidate pages by verified median views, niche relevance, audience geography, and transparent pricing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Complete Creator Approval:</strong> You approve every edit and its proposed destination before any assignment is committed.</span>
                </li>
              </ul>

              <Link
                href="/creator/campaigns/new"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300"
              >
                <span>Explore Creator Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Distribution Partner Side Card */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Distribution Partners</h3>
                  <p className="text-xs text-slate-400">Page Owners & Verified Social Publishers</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <span><strong>You Do Not Edit Videos:</strong> Receive studio-approved, finalized creative ready for publishing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <span><strong>Guaranteed Paid Assignments:</strong> Set your own placement rates ($100–$500+) per post on YouTube, Instagram, or TikTok.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <span><strong>Secure Expiring Links:</strong> Download your assigned asset directly via time-limited signed links.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <span><strong>Fast Payout Settlement:</strong> Automatic eligibility upon URL verification, disbursed via Stripe Connect or marketplace payouts.</span>
                </li>
              </ul>

              <Link
                href="/partner/pages/new"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Register Your Pages</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-slate-950 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to scale short-form video the authentic way?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Experience the combination of internal studio craftsmanship and AI-verified 1:1 distribution.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/creator/dashboard"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/20"
            >
              Open Creator Dashboard
            </Link>
            <Link
              href="/how-it-works"
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-semibold text-sm"
            >
              Read Architecture Spec
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
