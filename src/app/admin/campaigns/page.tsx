'use client';

import React, { useState, useEffect } from 'react';
import { Film, DollarSign, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function AdminCampaignsControlPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Campaign Control</h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervise active campaigns, production milestones, quote reconciliations, and distribution fulfillment.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-3.5">Campaign Title</th>
                <th className="p-3.5">Creator</th>
                <th className="p-3.5">Budget</th>
                <th className="p-3.5">Clips / Edits</th>
                <th className="p-3.5">Platforms</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white">{c.title}</td>
                  <td className="p-3.5 font-mono text-[11px] text-brand-300">{c.creator?.name}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">
                    ${(c.totalBudgetCents / 100).toFixed(2)}
                  </td>
                  <td className="p-3.5 font-mono">{c.desiredEditsCount} Requested</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-400">{c.targetPlatforms}</td>
                  <td className="p-3.5">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
