'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  BarChart2,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { VerificationBadge } from '@/components/ui/StatusPill';
import { OneEditOnePageCallout, AttributionNotice } from '@/components/ui/AttributionNotice';

export default function CreatorDiscoverPage() {
  const [finalEdits, setFinalEdits] = useState<any[]>([]);
  const [selectedEditId, setSelectedEditId] = useState<string>('EDIT-ACME-003');
  const [recommendationData, setRecommendationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load available final edits
  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        const edits: any[] = [];
        data.campaigns?.forEach((c: any) => {
          c.finalEdits?.forEach((fe: any) => {
            edits.push({
              ...fe,
              campaignTitle: c.title,
            });
          });
        });
        setFinalEdits(edits);

        // Auto select first edit if current not found
        if (edits.length > 0 && !edits.some((e) => e.id === selectedEditId)) {
          setSelectedEditId(edits[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch AI recommendations when selectedEditId changes
  useEffect(() => {
    if (!selectedEditId) return;
    setLoading(true);
    setStatusMessage(null);

    fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalEditId: selectedEditId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendationData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedEditId]);

  // Commit 1:1 Assignment Handler
  const handleCommitAssignment = async (socialPageId: string, agreedPriceCents: number) => {
    setCommitLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/assignments/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalEditId: selectedEditId,
          socialPageId,
          agreedPriceCents,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Assignment commitment failed');
      }

      setStatusMessage({
        type: 'success',
        text: `Success! ${selectedEditId} has been committed and strictly locked to this page. Invitation dispatched.`,
      });

      // Refresh recommendation data to reflect locked state
      const refreshed = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalEditId: selectedEditId }),
      }).then((r) => r.json());
      setRecommendationData(refreshed);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message,
      });
    } finally {
      setCommitLoading(false);
    }
  };

  const isAlreadyAssigned = recommendationData?.isAlreadyAssigned;
  const assignedPage = recommendationData?.assignedPage;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Page Matching Engine</h1>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-brand-500/10 text-brand-400 border border-brand-500/30">
            Deterministic v1.0
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Evaluate verified social page candidates scored by niche relevance, median views, audience fit, price, and delivery track record.
        </p>
      </div>

      <OneEditOnePageCallout
        editId={selectedEditId}
        pageHandle={assignedPage?.handle}
        platform={assignedPage?.platform}
      />

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Select Approved Edit Filter */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Select Final Approved Edit to Distribute
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {finalEdits.map((fe) => {
            const isSelected = selectedEditId === fe.id;
            const isAssigned = Boolean(fe.assignment);

            return (
              <button
                key={fe.id}
                onClick={() => setSelectedEditId(fe.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-brand-950/80 border-brand-500 shadow-md shadow-brand-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">{fe.id}</span>
                  {isAssigned ? (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      LOCKED 1:1
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      MATCHING
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">{fe.campaignTitle}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {fe.aspectRatio} • {fe.durationSeconds}s
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Locked State Warning if Already Assigned */}
      {isAlreadyAssigned && (
        <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/40 text-teal-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <div className="font-bold text-white">
                Edit {selectedEditId} is Committed to {assignedPage?.handle} ({assignedPage?.platform})
              </div>
              <div className="text-teal-300/80 text-[11px] mt-0.5">
                Status: {recommendationData?.assignmentStatus?.replace(/_/g, ' ')}. In accordance with ONE_EDIT_ONE_PAGE, re-assignment to another page is strictly disabled.
              </div>
            </div>
          </div>
          <Link
            href="/creator/placements"
            className="px-3 py-1.5 rounded-lg bg-teal-800/80 hover:bg-teal-700 text-white font-semibold text-xs whitespace-nowrap"
          >
            View Live Tracker
          </Link>
        </div>
      )}

      {/* Recommendations Candidates List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Candidate Page Recommendations ({recommendationData?.candidates?.length || 0})
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <span>Formula: Niche 25% • Median Views 20% • Audience 15% • Price 15% • Activity 10% • Delivery 10% • Verification 5%</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
            Running 7-factor recommendation analysis...
          </div>
        ) : (
          <div className="space-y-4">
            {recommendationData?.candidates?.map((item: any) => {
              const p = item.page;
              const isLockedDestination = assignedPage?.id === p.id;

              return (
                <div
                  key={p.id}
                  className={`p-6 rounded-2xl border transition-colors space-y-4 ${
                    isLockedDestination
                      ? 'bg-brand-950/50 border-brand-500 shadow-xl shadow-brand-500/10'
                      : item.isEligible
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  {/* Top Bar: Channel Info & Composite Score */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-white">{p.pageName}</span>
                        <span className="font-mono text-xs text-brand-300 font-semibold">{p.handle}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {p.platform}
                        </span>
                        <VerificationBadge level={p.verificationLevel} provenance={p.metricProvenance} />
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                        <span>Partner: {p.partnerBusinessName}</span>
                        <span>•</span>
                        <span>Rating: ★ {p.partnerRating}</span>
                        <span>•</span>
                        <span>Audience: {p.audienceMarkets}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-2xl font-mono font-extrabold text-white">
                          ${(p.placementPriceCents / 100).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500">Placement Fee</div>
                      </div>
                      <div className="pl-4 border-l border-slate-800">
                        <div className="text-2xl font-mono font-extrabold text-brand-400">
                          {item.compositeScore}%
                        </div>
                        <div className="text-[10px] text-slate-500">AI Fit Score</div>
                      </div>
                    </div>
                  </div>

                  {/* 7-Factor Fit Score Breakdown Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 truncate">Niche (25)</div>
                      <div className="font-mono font-bold text-slate-200">{item.breakdown.nicheScore}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 truncate">Views (20)</div>
                      <div className="font-mono font-bold text-slate-200">{item.breakdown.viewsScore}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 truncate">Audience (15)</div>
                      <div className="font-mono font-bold text-slate-200">{item.breakdown.audienceScore}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 truncate">Budget (15)</div>
                      <div className="font-mono font-bold text-slate-200">{item.breakdown.priceScore}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 truncate">Cadence (10)</div>
                      <div className="font-mono font-bold text-slate-200">{item.breakdown.activityScore}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 truncate">Delivery (10)</div>
                      <div className="font-mono font-bold text-slate-200">{item.breakdown.deliveryScore}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-500 truncate">Verify (5)</div>
                      <div className="font-mono font-bold text-slate-200">{item.breakdown.verificationScore}</div>
                    </div>
                  </div>

                  {/* AI Explanation & Caveats */}
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {item.explanation}
                    </p>

                    {item.missingDataCaveats?.length > 0 && (
                      <div className="space-y-1">
                        {item.missingDataCaveats.map((c: string, idx: number) => (
                          <div key={idx} className="text-amber-400/90 text-[11px] flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.exclusionReason && (
                      <div className="text-rose-400 text-[11px] flex items-center gap-1.5 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Excluded: {item.exclusionReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Commit Action Row */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">
                      Historical Median: {p.medianViews.toLocaleString()} views (Sample: {p.medianViewsSample} posts)
                    </div>

                    <div>
                      {isLockedDestination ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Assigned & Locked to This Page</span>
                        </span>
                      ) : isAlreadyAssigned ? (
                        <span className="text-xs text-slate-500 font-medium">
                          Assignment committed to another page
                        </span>
                      ) : item.isEligible ? (
                        <button
                          disabled={commitLoading}
                          onClick={() => handleCommitAssignment(p.id, p.placementPriceCents)}
                          className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-600/20 disabled:opacity-50"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Commit 1:1 Assignment to {p.handle}</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-600 font-medium">
                          Ineligible for assignment
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AttributionNotice />
    </div>
  );
}
