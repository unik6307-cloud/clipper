'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scissors,
  Play,
  Pause,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';
import { OneEditOnePageCallout } from '@/components/ui/AttributionNotice';

export default function CreatorStudioPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedClip, setSelectedClip] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      const list = data.campaigns || [];
      setCampaigns(list);

      // Default select first available clip/version
      if (list.length > 0) {
        const firstTask = list[0]?.editingTasks?.[0];
        const firstVersion = firstTask?.editVersions?.[0];
        if (firstVersion && !selectedClip) {
          setSelectedClip({
            ...firstVersion,
            campaignTitle: list[0].title,
            campaignId: list[0].id,
            finalEdit: list[0].finalEdits?.find((f: any) => f.editVersionId === firstVersion.id),
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveFinal = async (editVersionId: string) => {
    setActionLoading(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch(`/api/edits/${editVersionId}/approve`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedbackMsg(`Approved! Immutable Final Edit ID: ${data.finalEdit.id} generated with SHA-256 checksum.`);
      await loadData();
      if (selectedClip) {
        setSelectedClip({ ...selectedClip, finalEdit: data.finalEdit });
      }
    } catch (err: any) {
      setFeedbackMsg(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRevision = async (editVersionId: string) => {
    if (!revisionNotes) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/edits/${editVersionId}/request-revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackNotes: revisionNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedbackMsg('Revision requested. Internal editor notified.');
      setShowRevisionModal(false);
      setRevisionNotes('');
      await loadData();
    } catch (err: any) {
      setFeedbackMsg(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Collect all clips across campaigns
  const allClips: any[] = [];
  campaigns.forEach((c) => {
    c.editingTasks?.forEach((task: any) => {
      task.editVersions?.forEach((v: any) => {
        const finalEdit = c.finalEdits?.find((f: any) => f.editVersionId === v.id);
        allClips.push({
          ...v,
          campaignTitle: c.title,
          campaignId: c.id,
          finalEdit,
        });
      });
    });
  });

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Editing Studio & Review</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              QC Passed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Preview vertical drafts crafted by our internal team. Approve final versions to create immutable Edit IDs.
          </p>
        </div>

        {selectedClip?.finalEdit && (
          <Link
            href="/creator/discover"
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Destination Pages</span>
          </Link>
        )}
      </div>

      <OneEditOnePageCallout />

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-brand-950/60 border border-brand-500/40 text-brand-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Clips Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Draft Edits ({allClips.length})
          </div>

          <div className="space-y-2">
            {allClips.map((clip) => {
              const isSelected = selectedClip?.id === clip.id;
              const hasFinal = Boolean(clip.finalEdit);

              return (
                <button
                  key={clip.id}
                  onClick={() => setSelectedClip(clip)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-brand-500 shadow-lg shadow-brand-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400">v{clip.versionNumber}</span>
                    {hasFinal ? (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {clip.finalEdit.id}
                      </span>
                    ) : (
                      <StatusPill status={clip.status} />
                    )}
                  </div>
                  <div className="font-semibold text-xs text-white truncate">{clip.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>9:16 Vertical</span>
                    <span>•</span>
                    <span>{clip.durationSeconds}s</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Video Preview Player & Approval Controls */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {selectedClip ? (
            <>
              {/* Clip Title & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedClip.title}</h2>
                    <span className="text-xs font-mono text-slate-400">v{selectedClip.versionNumber}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Campaign: {selectedClip.campaignTitle}</div>
                </div>

                {selectedClip.finalEdit ? (
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 inline-block">
                      {selectedClip.finalEdit.id} (LOCKED)
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono truncate max-w-[200px]">
                      {selectedClip.finalEdit.checksumSha256.slice(0, 16)}...
                    </div>
                  </div>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Awaiting Creator Approval
                  </span>
                )}
              </div>

              {/* 9:16 Video Player Container */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative w-64 h-[440px] rounded-2xl bg-black border-2 border-slate-800 overflow-hidden shadow-2xl shrink-0 flex items-center justify-center">
                  <video
                    src={selectedClip.draftUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Clip Details, Hook & Caption */}
                <div className="flex-1 space-y-4 text-xs w-full">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">
                      Narrative Hook Description
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      "{selectedClip.hookDescription}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">
                      Prepared Social Caption & Hashtags
                    </span>
                    <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                      {selectedClip.captionText}
                    </p>
                  </div>

                  {selectedClip.qaNotes && (
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-[11px] space-y-0.5">
                      <div className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Quality Review Clearance:</span>
                      </div>
                      <p className="text-emerald-300/80">{selectedClip.qaNotes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex gap-3">
                    {selectedClip.finalEdit ? (
                      <Link
                        href="/creator/discover"
                        className="flex-1 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Find Matching Social Page for {selectedClip.finalEdit.id}</span>
                      </Link>
                    ) : (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleApproveFinal(selectedClip.id)}
                          className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Final & Generate Edit ID</span>
                        </button>
                        <button
                          onClick={() => setShowRevisionModal(true)}
                          className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Request Revision</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-slate-400">
              No draft clips currently loaded.
            </div>
          )}
        </div>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Request Clip Revision</span>
            </h3>
            <p className="text-slate-400">
              Provide feedback for internal video editors (e.g. adjust hook timing, change captions font, trim outro).
            </p>
            <textarea
              rows={4}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="Explain required changes..."
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading || !revisionNotes}
                onClick={() => handleRequestRevision(selectedClip.id)}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold disabled:opacity-50"
              >
                Submit Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
