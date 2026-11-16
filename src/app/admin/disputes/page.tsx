'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadDisputes = () => {
    fetch('/api/disputes')
      .then((res) => res.json())
      .then((data) => {
        setDisputes(data.disputes || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleResolve = async (disputeId: string, status: string) => {
    try {
      const res = await fetch('/api/disputes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disputeId,
          resolutionStatus: status,
          resolutionNotes: resolutionNotes || 'Resolved after evidence inspection.',
        }),
      });
      if (res.ok) {
        setSelectedDispute(null);
        setResolutionNotes('');
        loadDisputes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Disputes & Copyright Takedowns</h1>
        <p className="text-xs text-slate-400 mt-1">
          Investigate non-publication claims, copyright notices, and execute immediate legal takedowns or refunds.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 font-bold text-white uppercase tracking-wider text-[11px]">
          Dispute Queue ({disputes.length} Tickets)
        </div>

        {disputes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="font-semibold text-white">Zero Active Disputes</div>
            <p className="text-[11px] text-slate-500 mt-1">All placements and copyright claims are currently clear.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {disputes.map((d) => (
              <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-400">DISP-{d.id.slice(-6).toUpperCase()}</span>
                    <span className="font-semibold text-white">{d.reasonCategory}</span>
                    <StatusPill status={d.status} />
                  </div>
                  <div className="text-slate-300">{d.description}</div>
                  <div className="text-[11px] text-slate-500">
                    Raised by: {d.raisedByUser?.name} ({d.raisedByUser?.email}) • Campaign: {d.campaign?.title}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {d.status === 'OPEN' && (
                    <>
                      <button
                        onClick={() => handleResolve(d.id, 'RESOLVED_REFUND')}
                        className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px]"
                      >
                        Refund Creator
                      </button>
                      <button
                        onClick={() => handleResolve(d.id, 'RESOLVED_UPHELD')}
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                      >
                        Dismiss / Upheld
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
