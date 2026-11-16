'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Clock, AlertTriangle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function CampaignOperationsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Campaign Operations & Publishing Deadlines</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor campaign milestones, partner acceptance turnaround, and publishing window deadlines.
        </p>
      </div>

      <div className="space-y-4">
        {campaigns.map((cmp) => (
          <div key={cmp.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{cmp.title}</span>
                  <StatusPill status={cmp.status} />
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Creator: {cmp.creator?.name} ({cmp.creator?.email})
                </div>
              </div>
              <div className="text-right font-mono text-[11px] text-slate-400">
                Window: {new Date(cmp.publishingWindowStart).toLocaleDateString()} -{' '}
                {new Date(cmp.publishingWindowEnd).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cmp.finalEdits?.map((fe: any) => {
                const asg = fe.assignment;
                return (
                  <div key={fe.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-brand-300">{fe.id}</span>
                      <StatusPill status={asg?.status || fe.status} />
                    </div>
                    <div className="text-slate-300 truncate">{fe.editVersion?.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {asg ? `Locked: ${asg.socialPage?.handle}` : 'Awaiting 1:1 Match'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
