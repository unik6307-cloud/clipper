'use client';

import React, { useState, useEffect } from 'react';
import { Database, Lock, ShieldCheck, FileVideo, CheckCircle2 } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function AdminAssetRegistryPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns || []));
  }, []);

  const allFinalEdits: any[] = [];
  campaigns.forEach((c) => {
    c.finalEdits?.forEach((fe: any) => {
      allFinalEdits.push({ ...fe, campaignTitle: c.title });
    });
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Asset & Edit Registry</h1>
        <p className="text-xs text-slate-400 mt-1">
          Immutable registry of opaque Edit IDs, SHA-256 hashes, storage keys, and strict 1:1 lock bindings.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 font-bold text-white uppercase tracking-wider text-[11px]">
          Approved Final Creative Vault ({allFinalEdits.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-3.5">Edit ID</th>
                <th className="p-3.5">Campaign</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">SHA-256 Cryptographic Hash</th>
                <th className="p-3.5">Assigned Destination Page</th>
                <th className="p-3.5">Vault Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {allFinalEdits.map((fe) => (
                <tr key={fe.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono text-white font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-400" />
                    <span>{fe.id}</span>
                  </td>
                  <td className="p-3.5 text-slate-300">{fe.campaignTitle}</td>
                  <td className="p-3.5 font-mono">{fe.durationSeconds}s (9:16)</td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-400 truncate max-w-[200px]" title={fe.checksumSha256}>
                    {fe.checksumSha256}
                  </td>
                  <td className="p-3.5 font-mono text-brand-300 font-semibold">
                    {fe.assignment ? `${fe.assignment.socialPage?.handle} (${fe.assignment.socialPage?.platform})` : 'Unassigned'}
                  </td>
                  <td className="p-3.5">
                    <StatusPill status={fe.status} />
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
