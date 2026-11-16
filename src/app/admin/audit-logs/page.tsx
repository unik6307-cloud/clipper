'use client';

import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Lock, DollarSign, CheckCircle2 } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Immutable System Audit Trail</h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically recorded logs of all creator approvals, 1:1 assignment commits, and payout settlements.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 font-bold text-white uppercase tracking-wider text-[11px] flex justify-between items-center">
          <span>Audit Events ({logs.length} Logged)</span>
          <span className="text-slate-500 font-mono text-[10px]">Tamper-Resistant Storage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Actor & Role</th>
                <th className="p-3.5">Entity Type & ID</th>
                <th className="p-3.5">State Payload Snapshot</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono text-brand-300 font-bold">{log.action}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{log.actor?.name || 'System'}</div>
                    <div className="text-slate-500 text-[10px] font-mono">{log.actorRole}</div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-400">
                    <span className="text-slate-300">{log.entityType}</span> / {log.entityId}
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-400 max-w-[260px] truncate" title={log.newStateJson || ''}>
                    {log.newStateJson || '—'}
                  </td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">{log.ipAddress}</td>
                  <td className="p-3.5 text-slate-400 text-[11px] font-mono">
                    {new Date(log.createdAt).toLocaleTimeString()}
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
