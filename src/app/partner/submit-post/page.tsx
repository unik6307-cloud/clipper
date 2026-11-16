'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, CheckCircle2, AlertCircle, Link as LinkIcon, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PartnerSubmitPostPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [publicPostUrl, setPublicPostUrl] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);

  useEffect(() => {
    fetch('/api/partner/assignments')
      .then((res) => res.json())
      .then((data) => {
        const asgs = data.assignments || [];
        setAssignments(asgs);
        if (asgs.length > 0 && !selectedAssignmentId) {
          // Select first assignment that hasn't submitted yet
          const unsubmitted = asgs.find((a: any) => !a.publishedPost) || asgs[0];
          setSelectedAssignmentId(unsubmitted.id);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId || !publicPostUrl) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/partner/submit-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: selectedAssignmentId,
          publicPostUrl,
          evidenceUrl,
          submissionNotes,
          publishedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedAsg = assignments.find((a) => a.id === selectedAssignmentId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Submit Published Post URL</h1>
        <p className="text-xs text-slate-400 mt-1">
          Provide the live URL of the published video for automated domain verification and QA review.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 text-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Post Submitted For Verification</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              {success.message} Official API adapters and QA reviewers check the live post. Once verified, payout eligibility is unlocked immediately.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1 font-mono text-[11px]">
            <div className="text-slate-400">Assignment: {selectedAsg?.finalEditId}</div>
            <div className="text-brand-300 break-all">URL: {publicPostUrl}</div>
            <div className="text-emerald-400">Status: PENDING_VERIFICATION</div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => router.push('/partner/assignments')}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
            >
              Return to My Assignments
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Select Publishing Assignment</label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-brand-500"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.finalEditId} — {a.socialPage?.handle} ({a.socialPage?.platform}) [${(a.agreedPriceCents / 100).toFixed(2)}]
                </option>
              ))}
            </select>
          </div>

          {selectedAsg && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px] space-y-1">
              <div>
                Target Channel: <strong className="text-white font-mono">{selectedAsg.socialPage?.handle}</strong> on{' '}
                <strong className="text-white">{selectedAsg.socialPage?.platform}</strong>
              </div>
              <div>
                Compensation: <strong className="text-emerald-400 font-mono">${(selectedAsg.agreedPriceCents / 100).toFixed(2)}</strong>
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Public Live Post URL</label>
            <input
              type="url"
              required
              value={publicPostUrl}
              onChange={(e) => setPublicPostUrl(e.target.value)}
              placeholder={
                selectedAsg?.socialPage?.platform === 'YOUTUBE'
                  ? 'https://youtube.com/shorts/dQw4w9WgXcQ'
                  : selectedAsg?.socialPage?.platform === 'INSTAGRAM'
                  ? 'https://instagram.com/reel/C38x9...'
                  : 'https://tiktok.com/@handle/video/1234...'
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              URL must be public and published directly on {selectedAsg?.socialPage?.handle}.
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Evidence Screenshot URL (Optional backup proof)
            </label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://... screenshot link or post preview"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Submission Notes (Optional)</label>
            <textarea
              rows={2}
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="e.g. Published with pinned comment link as requested in brief."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
            Platform Policy: Posts are verified using official API adapters or QA review. Submissions are never marked complete solely because a button is pressed.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={loading || !publicPostUrl}
              className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Validating Link...' : 'Submit URL for Verification'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
