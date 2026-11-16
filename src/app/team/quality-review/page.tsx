'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Video,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function QualityReviewPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Quality Review Checklist Items
  const [checklist, setChecklist] = useState({
    formatRatio: true,
    audioNormalized: true,
    captionsAccurate: true,
    hookClear: true,
    noWatermarks: true,
    rightsCompliant: true,
    duplicateCheckPassed: true,
  });

  const loadData = () => {
    fetch('/api/editor/tasks')
      .then((res) => res.json())
      .then((data) => {
        const list = data.tasks || [];
        setTasks(list);

        // Find a version pending review or first
        let foundVer: any = null;
        for (const t of list) {
          const v = t.editVersions?.find((ver: any) => ver.status === 'QA_PENDING');
          if (v) {
            foundVer = { ...v, campaignTitle: t.campaign?.title };
            break;
          }
        }
        if (!foundVer && list[0]?.editVersions?.[0]) {
          foundVer = { ...list[0].editVersions[0], campaignTitle: list[0].campaign?.title };
        }
        setSelectedVersion(foundVer);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewAction = async (action: 'APPROVE' | 'REQUEST_CHANGES') => {
    if (!selectedVersion) return;
    setActionLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/qa/review-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editVersionId: selectedVersion.id,
          action,
          checklist,
          notes:
            action === 'APPROVE'
              ? 'QA Passed: EBU R128 audio (-14 LUFS), 9:16 vertical ratio, kinetic typography, and rights verification cleared.'
              : 'Adjustments required: check hook pacing or caption accuracy.',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg(data.message);
      loadData();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Extract all pending edit versions
  const allVersions: any[] = [];
  tasks.forEach((t) => {
    t.editVersions?.forEach((v: any) => {
      allVersions.push({ ...v, campaignTitle: t.campaign?.title });
    });
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Quality Review & Standards Gate</h1>
        <p className="text-xs text-slate-400 mt-1">
          Internal quality control: enforce export specifications, audio normalization, and copyright standards.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Queue of Versions */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Review Queue ({allVersions.length})
          </div>

          <div className="space-y-2">
            {allVersions.map((ver) => {
              const isSelected = selectedVersion?.id === ver.id;
              return (
                <button
                  key={ver.id}
                  onClick={() => setSelectedVersion(ver)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400">v{ver.versionNumber}</span>
                    <StatusPill status={ver.status} />
                  </div>
                  <div className="font-semibold text-xs text-white truncate">{ver.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">{ver.campaignTitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Inspection & Checklist */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
          {selectedVersion ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white">{selectedVersion.title}</h2>
                  <div className="text-slate-400 text-xs">Campaign: {selectedVersion.campaignTitle}</div>
                </div>
                <StatusPill status={selectedVersion.status} />
              </div>

              {/* Video Player & Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 relative h-80 rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
                  <video
                    src={selectedVersion.draftUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-7 space-y-3">
                  <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                    Technical & Editorial Quality Checklist
                  </div>

                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.formatRatio}
                        onChange={(e) => setChecklist({ ...checklist, formatRatio: e.target.checked })}
                        className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-slate-200">9:16 vertical ratio & 1080x1920 minimum</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.audioNormalized}
                        onChange={(e) => setChecklist({ ...checklist, audioNormalized: e.target.checked })}
                        className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-slate-200">EBU R128 audio normalization (-14 LUFS)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.captionsAccurate}
                        onChange={(e) => setChecklist({ ...checklist, captionsAccurate: e.target.checked })}
                        className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-slate-200">Subtitles verified for spelling & timing</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.hookClear}
                        onChange={(e) => setChecklist({ ...checklist, hookClear: e.target.checked })}
                        className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-slate-200">First 3 seconds establish clear narrative hook</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.noWatermarks}
                        onChange={(e) => setChecklist({ ...checklist, noWatermarks: e.target.checked })}
                        className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-slate-200">Zero unapproved watermarks or black frames</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.rightsCompliant}
                        onChange={(e) => setChecklist({ ...checklist, rightsCompliant: e.target.checked })}
                        className="rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-slate-200">Commercial music sync & brand compliance</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex justify-end gap-3">
                <button
                  disabled={actionLoading}
                  onClick={() => handleReviewAction('REQUEST_CHANGES')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Return with Correction Notes</span>
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => handleReviewAction('APPROVE')}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Release to Creator Review</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">Select an edit version to inspect.</div>
          )}
        </div>
      </div>
    </div>
  );
}
