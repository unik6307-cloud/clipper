'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Inbox, CheckCircle2, XCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function PartnerInvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const loadInvitations = () => {
    fetch('/api/partner/invitations')
      .then((res) => res.json())
      .then((data) => {
        setInvitations(data.invitations || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleAction = async (invitationId: string, action: 'ACCEPT' | 'DECLINE') => {
    setActionLoading(invitationId);
    setMsg(null);
    try {
      const res = await fetch('/api/partner/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg(data.message);
      loadInvitations();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Campaign Invitations</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review paid placement invitations matched to your registered channels.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading invitations...</div>
      ) : invitations.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No pending invitations</h3>
          <p className="text-xs text-slate-400">
            When creators approve edits matched to your channels, invitations will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((inv) => {
            const asg = inv.assignment;
            const cmp = asg?.campaign;
            const page = inv.socialPage;
            const isPending = inv.status === 'PENDING';

            return (
              <div
                key={inv.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-white">{cmp?.title}</span>
                      <StatusPill status={inv.status} />
                    </div>
                    <div className="text-xs text-slate-400">
                      Target Channel:{' '}
                      <span className="font-mono text-brand-300 font-semibold">{page?.handle}</span> ({page?.platform}) • Niche: {cmp?.contentNiche}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-emerald-400">
                      ${(inv.proposedFeeCents / 100).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Net Paid to You</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Edit Duration</span>
                    <span className="font-mono text-white font-bold">{asg?.finalEdit?.durationSeconds}s Vertical (9:16)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Assigned Edit ID</span>
                    <span className="font-mono text-brand-300 font-bold">{asg?.finalEdit?.id}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Response Deadline</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {isPending ? (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-slate-400">
                      Upon acceptance, asset download link will unlock for {page?.handle}.
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={actionLoading === inv.id}
                        onClick={() => handleAction(inv.id, 'DECLINE')}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Decline
                      </button>
                      <button
                        disabled={actionLoading === inv.id}
                        onClick={() => handleAction(inv.id, 'ACCEPT')}
                        className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20"
                      >
                        Accept Assignment (${(inv.proposedFeeCents / 100).toFixed(2)})
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Response recorded: <strong className="text-white">{inv.status}</strong>
                    </span>
                    {inv.status === 'ACCEPTED' && (
                      <Link
                        href="/partner/assignments"
                        className="text-xs text-brand-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Go to My Assignments & Download File</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
