'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Share2,
  DollarSign,
  Download,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import { StatusPill, VerificationBadge } from '@/components/ui/StatusPill';

export default function PartnerDashboardPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/partner/invitations').then((r) => r.json()),
      fetch('/api/partner/assignments').then((r) => r.json()),
      fetch('/api/partner/pages').then((r) => r.json()),
    ])
      .then(([invData, asgData, pageData]) => {
        setInvitations(invData.invitations || []);
        setAssignments(asgData.assignments || []);
        setPages(pageData.pages || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const pendingInvites = invitations.filter((i) => i.status === 'PENDING');
  const activeAssignments = assignments.filter((a) =>
    ['ASSET_ACCESS_GRANTED', 'PUBLISHING_DUE'].includes(a.status)
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Distribution Partner Portal</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              DevNetwork Media
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accept paid placements, download studio-approved video assets, and submit live publication links.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/partner/submit-post"
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Live Post URL</span>
          </Link>
        </div>
      </div>

      {/* Non-Editing Banner */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-300">Marketplace Publishing Protocol</div>
          <p className="text-amber-200/80 leading-relaxed">
            Distribution partners do not edit or alter creative assets. Download your assigned video, publish it on your registered channel, and submit the public link for automated QA verification.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Pending Invitations</span>
          <div className="text-2xl font-mono font-bold text-indigo-400 mt-1">{pendingInvites.length}</div>
          <span className="text-[10px] text-slate-500">Action Required</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Publishing Due</span>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1">{activeAssignments.length}</div>
          <span className="text-[10px] text-slate-500">Active Deadlines</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Lifetime Earnings</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">$8,400.00</div>
          <span className="text-[10px] text-emerald-400">Stripe Connected</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Verified Social Pages</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{pages.length}</div>
          <span className="text-[10px] text-slate-500">YouTube, IG & TikTok</span>
        </div>
      </div>

      {/* Pending Invitations Box */}
      {pendingInvites.length > 0 && (
        <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">New Placement Invitations</h2>
            </div>
            <Link
              href="/partner/invitations"
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              View All ({pendingInvites.length})
            </Link>
          </div>

          <div className="space-y-3">
            {pendingInvites.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-white text-sm">{inv.assignment?.campaign?.title}</div>
                  <div className="text-slate-400">
                    Destination: <span className="text-brand-300 font-mono">{inv.socialPage?.handle}</span> ({inv.socialPage?.platform}) • Duration: {inv.assignment?.finalEdit?.durationSeconds}s
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-base font-mono font-bold text-emerald-400">
                      ${(inv.proposedFeeCents / 100).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Your Compensation</div>
                  </div>
                  <Link
                    href="/partner/invitations"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md"
                  >
                    Review Invitation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Assignments Overview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Active Publishing Assignments</h2>
          <Link href="/partner/assignments" className="text-xs text-brand-400 hover:underline">
            Manage All ({assignments.length})
          </Link>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {assignments.map((asg) => (
            <div key={asg.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {asg.finalEditId}
                  </span>
                  <span className="font-mono text-brand-300 font-medium">{asg.socialPage?.handle}</span>
                  <StatusPill status={asg.status} />
                </div>
                <div className="text-slate-400">
                  {asg.finalEdit?.editVersion?.title} • Compensation: ${(asg.agreedPriceCents / 100).toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/partner/assignments"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </Link>
                <Link
                  href="/partner/submit-post"
                  className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Live URL</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
