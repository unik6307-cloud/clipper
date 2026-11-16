'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { VerificationBadge } from '@/components/ui/StatusPill';

export default function AdminPagesVerificationPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPages = () => {
    fetch('/api/partner/pages')
      .then((res) => res.json())
      .then((data) => {
        setPages(data.pages || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Social Page Verification & Audit</h1>
        <p className="text-xs text-slate-400 mt-1">
          Verify channel ownership evidence, inspect metric provenance, and enforce brand safety restrictions.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-3.5">Channel / Handle</th>
                <th className="p-3.5">Platform</th>
                <th className="p-3.5">Verification Level</th>
                <th className="p-3.5">Provenance</th>
                <th className="p-3.5">Median Views</th>
                <th className="p-3.5">Placement Price</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{p.pageName}</div>
                    <a
                      href={p.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-brand-300 text-[11px] hover:underline flex items-center gap-1"
                    >
                      <span>{p.handle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{p.platform}</td>
                  <td className="p-3.5">
                    <VerificationBadge level={p.verificationLevel} />
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-400">{p.metricProvenance}</td>
                  <td className="p-3.5 font-mono font-bold text-white">
                    {p.medianViews.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400 font-bold">
                    ${(p.placementPriceCents / 100).toFixed(2)}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => alert(`Verification details verified for ${p.handle}`)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium"
                    >
                      Inspect Audit Proof
                    </button>
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
