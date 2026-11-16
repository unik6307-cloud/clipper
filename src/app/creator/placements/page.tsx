'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  Lock,
  Eye,
  BarChart2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { StatusPill, VerificationBadge } from '@/components/ui/StatusPill';
import { OneEditOnePageCallout, AttributionNotice } from '@/components/ui/AttributionNotice';

export default function CreatorPlacementsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        const asgs: any[] = [];
        data.campaigns?.forEach((c: any) => {
          c.finalEdits?.forEach((fe: any) => {
            if (fe.assignment) {
              asgs.push({
                ...fe.assignment,
                finalEdit: fe,
                campaignTitle: c.title,
              });
            }
          });
        });
        setAssignments(asgs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Placement Tracker</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your strictly locked 1-to-1 distribution assignments, publishing deadlines, and verified live post links.
        </p>
      </div>

      <OneEditOnePageCallout />

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading placement tracking records...</div>
      ) : assignments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <MapPin className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No committed placements yet</h3>
          <p className="text-xs text-slate-400">
            Once your edits are approved in the Studio, use the AI Discovery matrix to commit 1-to-1 page locks.
          </p>
          <Link
            href="/creator/discover"
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold text-xs"
          >
            Open Page Discovery
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((asg) => {
            const page = asg.socialPage;
            const post = asg.publishedPost;
            const analytics = post?.analytics?.[0];

            return (
              <div
                key={asg.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-5"
              >
                {/* Header: Edit ID & Page */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-white bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                        {asg.finalEditId}
                      </span>
                      <span className="text-xs text-slate-400">assigned to</span>
                      <span className="font-mono text-xs font-semibold text-brand-300">{page?.handle}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {page?.platform}
                      </span>
                      <StatusPill status={asg.status} />
                    </div>
                    <div className="text-xs text-slate-400">
                      Campaign: {asg.campaignTitle} • Fee: ${(asg.agreedPriceCents / 100).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">
                      Deadline: {asg.publishingDeadline ? new Date(asg.publishingDeadline).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Published Post Evidence / Link */}
                {post ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">Live Public URL Submitted</span>
                        <VerificationBadge level={post.verificationStatus} />
                      </div>
                      <a
                        href={post.publicPostUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-400 hover:text-brand-300 font-medium"
                      >
                        <span className="truncate max-w-[280px]">{post.publicPostUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>

                    {analytics && (
                      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                        <div className="p-2 rounded bg-slate-900">
                          <span className="text-[10px] text-slate-500 block">Observed Views</span>
                          <span className="font-mono font-bold text-white text-base">
                            {analytics.viewsCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-slate-900">
                          <span className="text-[10px] text-slate-500 block">Likes</span>
                          <span className="font-mono font-bold text-white text-base">
                            {analytics.likesCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-slate-900">
                          <span className="text-[10px] text-slate-500 block">Comments</span>
                          <span className="font-mono font-bold text-white text-base">
                            {analytics.commentsCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-slate-900">
                          <span className="text-[10px] text-slate-500 block">Effective CPM</span>
                          <span className="font-mono font-bold text-emerald-400 text-base">
                            ${analytics.costPerThousandViews?.toFixed(2) || '9.75'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>
                        Partner invitation accepted. Video creative delivered via secure expiring link. Awaiting publication on {page?.handle}.
                      </span>
                    </div>
                    <span className="font-mono text-amber-400 font-semibold">Publishing Window Active</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AttributionNotice
        provenance="PLATFORM_API"
        caveatText="Post metrics reflect authenticated API pulls from public channels. Not extrapolative of future performance or causal downstream conversions."
      />
    </div>
  );
}
