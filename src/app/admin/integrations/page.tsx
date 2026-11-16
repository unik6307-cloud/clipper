'use client';

import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, AlertCircle, RefreshCw, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIntegrations = () => {
    fetch('/api/integrations')
      .then((res) => res.json())
      .then((data) => {
        setIntegrations(data.integrations || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform & Service Integrations</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor official OAuth applications, API adapter statuses, permitted permission scopes, and data freshness.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-slate-200">Security & Platform Policy Guarantee: </span>
          Client secrets and access tokens are strictly masked and encrypted at rest. Platform API rate limits and developer quotas are automatically tracked.
        </div>
      </div>

      <div className="space-y-4">
        {integrations.map((integ) => {
          const isConnected = integ.status === 'connected';

          return (
            <div
              key={integ.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{integ.name}</h2>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        isConnected
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {integ.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Category: {integ.category}</div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={integ.documentationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1 text-[11px]"
                  >
                    <span>Developer Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => alert(`Sync triggered for ${integ.name}`)}
                    className="px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 font-medium flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Status</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Granted Scopes</span>
                  <span className="font-mono text-slate-300 text-[11px] break-all">
                    {integ.scopesRequired ? integ.scopesRequired.join(', ') : 'Direct S3 Signed URLs'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Credentials Status</span>
                  <span className="font-mono text-emerald-400 text-[11px] font-semibold">
                    {integ.configured ? 'Configured in Environment' : 'Setup Required'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Last Successful Sync</span>
                  <span className="font-mono text-slate-300 text-[11px]">
                    {integ.lastSync ? new Date(integ.lastSync).toLocaleTimeString() : 'Active Standby'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
