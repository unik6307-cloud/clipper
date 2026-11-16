import React from 'react';
import { ShieldAlert, Info, Lock } from 'lucide-react';

export function AttributionNotice({
  provenance = 'PLATFORM_API',
  lastUpdated,
  sampleSize,
  caveatText,
}: {
  provenance?: string;
  lastUpdated?: string | Date;
  sampleSize?: number;
  caveatText?: string;
}) {
  const formattedDate = lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Recent snapshot';

  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
      <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-200">Metric Provenance:</span>
          <span className="text-sky-300 uppercase tracking-wider font-mono text-[11px]">
            {provenance.replace(/_/g, ' ')}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Captured: {formattedDate}</span>
          {sampleSize && (
            <>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Sample: {sampleSize} eligible posts</span>
            </>
          )}
        </div>
        <p className="text-slate-400 leading-relaxed">
          {caveatText ||
            'Observed organic performance only. The platform never fabricates live statistics or claims guaranteed virality or causal conversion.'}
        </p>
      </div>
    </div>
  );
}

export function OneEditOnePageCallout({
  editId,
  pageHandle,
  platform,
}: {
  editId?: string;
  pageHandle?: string;
  platform?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-lg bg-brand-950/40 border border-brand-500/30 text-xs text-brand-200">
      <Lock className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
      <div className="space-y-1">
        <div className="font-semibold text-brand-300 flex items-center gap-1.5">
          <span>Non-Negotiable Rule: ONE_EDIT_ONE_PAGE</span>
          <span className="px-1.5 py-0.2 bg-brand-500/20 rounded font-mono text-[10px]">
            LOCKED 1:1
          </span>
        </div>
        <p className="text-brand-300/80 leading-relaxed">
          {editId ? (
            <>
              Final Edit <strong className="text-white font-mono">{editId}</strong> is assigned{' '}
              {pageHandle ? (
                <>
                  exclusively to <strong className="text-white font-mono">{pageHandle}</strong> on{' '}
                  <strong className="text-white">{platform || 'Social'}</strong>.
                </>
              ) : (
                'to exactly one registered distribution page.'
              )}{' '}
              Distributing or re-assigning this Edit ID to any second page is strictly prohibited and blocked at the database engine level.
            </>
          ) : (
            'Every unique finalized short edit is distributed to exactly one social page. Partners never edit videos; they only publish the single approved creative.'
          )}
        </p>
      </div>
    </div>
  );
}
