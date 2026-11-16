'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Scissors,
  Lock,
  ArrowRight,
  Sparkles,
  BarChart3,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';
import { VerificationBadge, StatusPill } from '@/components/ui/StatusPill';
import { AttributionNotice, OneEditOnePageCallout } from '@/components/ui/AttributionNotice';

export default function CreatorDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const campaigns = data?.campaigns || [];
  const primaryCampaign = campaigns[0];

  // Calculate aggregates
  const totalSpendCents = campaigns.reduce((acc: number, c: any) => acc + (c.totalBudgetCents || 0), 0);
  const totalEdits = campaigns.reduce((acc: number, c: any) => acc + (c.finalEdits?.length || 0), 0);
  const totalAssignments = campaigns.reduce(
    (acc: number, c: any) =>
      acc + (c.finalEdits?.filter((e: any) => e.assignment)?.length || 0),
    0
  );

  // Total observed views from verified published posts
  let totalObservedViews = 0;
  campaigns.forEach((c: any) => {
    c.finalEdits?.forEach((e: any) => {
      const post = e.assignment?.publishedPost;
      post?.analytics?.forEach((a: any) => {
        totalObservedViews += a.viewsCount || 0;
      });
    });
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Creator Dashboard</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Acme Media Labs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track editing workflows, approve final cuts, and monitor exclusive 1:1 distribution placements.
          </p>
        </div>
        <Link
          href="/creator/campaigns/new"
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5 transition-colors"
        >
          <span>New Campaign Wizard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Non-Negotiable Rule Callout */}
      <OneEditOnePageCallout />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Spend</div>
          <div className="text-2xl font-mono font-bold text-white">
            ${(totalSpendCents / 100).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">Itemized & Cleared</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Approved Final Edits</div>
          <div className="text-2xl font-mono font-bold text-brand-400">{totalEdits}</div>
          <div className="text-[11px] text-slate-500">Immutable Edit IDs</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Committed Placements</div>
          <div className="text-2xl font-mono font-bold text-indigo-400">{totalAssignments}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">1:1 Locked Pages</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Observed Post Views</div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {totalObservedViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">API Verified Snapshot</div>
        </div>
      </div>

      {/* Metric Provenance Notice */}
      <AttributionNotice
        provenance="PLATFORM_API"
        sampleSize={20}
        caveatText="Observed metrics reflect authentic snapshots from YouTube Shorts and Instagram Reels APIs. Clipper never promises artificial virality or guaranteed views."
      />

      {/* Active Campaign Status & Editing Pipeline */}
      {primaryCampaign && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Campaign:</span>
                <span className="text-base font-bold text-white">{primaryCampaign.title}</span>
                <StatusPill status={primaryCampaign.status} />
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Target: {primaryCampaign.contentNiche} • Platforms: {primaryCampaign.targetPlatforms}
              </div>
            </div>
            <Link
              href="/creator/studio"
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
            >
              <span>Open Studio Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Edits in this campaign */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Assigned & Finalized Edits
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {primaryCampaign.finalEdits?.map((edit: any) => {
                const asg = edit.assignment;
                return (
                  <div
                    key={edit.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-brand-300">{edit.id}</span>
                        <StatusPill status={edit.status} />
                      </div>
                      <div className="text-xs font-semibold text-slate-200">
                        {edit.editVersion?.title || 'Approved Clip'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Aspect: {edit.aspectRatio} • Duration: {edit.durationSeconds}s
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                      {asg ? (
                        <div className="space-y-1">
                          <div className="text-slate-400 flex items-center justify-between">
                            <span>Assigned Page:</span>
                            <span className="text-white font-mono">{asg.socialPage?.handle}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Status:</span>
                            <span className="text-emerald-400 font-semibold font-mono text-[10px]">
                              {asg.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-amber-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Unassigned — Ready for Match</span>
                          </div>
                          <Link
                            href="/creator/discover"
                            className="block w-full py-1 text-center rounded bg-brand-600/80 hover:bg-brand-500 text-white font-semibold text-[11px]"
                          >
                            Find Destination Page
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/creator/studio"
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/40 transition-colors space-y-1"
        >
          <Scissors className="w-5 h-5 text-brand-400 mb-2" />
          <div className="font-bold text-white text-sm">Editing Studio</div>
          <div className="text-xs text-slate-400">Preview draft cuts, request revisions, and approve final Edit IDs.</div>
        </Link>

        <Link
          href="/creator/discover"
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/40 transition-colors space-y-1"
        >
          <Sparkles className="w-5 h-5 text-indigo-400 mb-2" />
          <div className="font-bold text-white text-sm">AI Page Discovery</div>
          <div className="text-xs text-slate-400">Score candidate channels and commit 1-to-1 distribution locks.</div>
        </Link>

        <Link
          href="/creator/placements"
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/40 transition-colors space-y-1"
        >
          <Lock className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="font-bold text-white text-sm">Placement Tracker</div>
          <div className="text-xs text-slate-400">Inspect live post URLs, verification proof, and audience CPM.</div>
        </Link>
      </div>
    </div>
  );
}
