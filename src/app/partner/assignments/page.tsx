'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  Lock,
  Send,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function PartnerAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadModal, setDownloadModal] = useState<any>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const loadAssignments = () => {
    fetch('/api/partner/assignments')
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.assignments || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleGetDownload = async (assignmentId: string) => {
    setDownloadLoading(true);
    try {
      const res = await fetch('/api/partner/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, action: 'GET_DOWNLOAD_URL' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setDownloadModal(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Publishing Assignments</h1>
        <p className="text-xs text-slate-400 mt-1">
          Download studio-approved creatives via expiring links and review exact publication instructions.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-300">Mandatory Creator Creative Integrity</div>
          <p className="text-amber-200/80 leading-relaxed">
            You must publish the exact approved file downloaded below. Modifying audio, cutting out branding, or removing synchronized captions is prohibited under your partner terms.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Lock className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No active assignments</h3>
          <p className="text-xs text-slate-400">Accepted campaign invitations will appear here with asset downloads.</p>
          <Link
            href="/partner/invitations"
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
          >
            Check Invitations
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((asg) => {
            const page = asg.socialPage;
            const edit = asg.finalEdit;
            const post = asg.publishedPost;

            return (
              <div
                key={asg.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-white bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                        {asg.finalEditId}
                      </span>
                      <span className="font-mono text-xs font-semibold text-brand-300">{page?.handle}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {page?.platform}
                      </span>
                      <StatusPill status={asg.status} />
                    </div>
                    <div className="text-xs text-slate-400">
                      Campaign: {asg.campaign?.title} • Compensation: ${(asg.agreedPriceCents / 100).toFixed(2)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">
                      Deadline: {asg.publishingDeadline ? new Date(asg.publishingDeadline).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Instructions Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="font-semibold text-slate-300">Publication Copy Instructions:</div>
                  <div className="p-2.5 rounded bg-slate-900 font-mono text-[11px] text-slate-300 select-all border border-slate-800">
                    {edit?.editVersion?.captionText || 'Watch full interview! #podcast #shorts #viral'}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <button
                    disabled={downloadLoading}
                    onClick={() => handleGetDownload(asg.id)}
                    className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Final Video (Expiring Signed URL)</span>
                  </button>

                  {post ? (
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">Post submitted ({post.verificationStatus})</span>
                      <a
                        href={post.publicPostUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-400 hover:underline flex items-center gap-0.5 font-mono text-[11px]"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <Link
                      href="/partner/submit-post"
                      className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Published URL</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expiring Download Modal */}
      {downloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secure Expiring Download Ready</span>
              </h3>
              <button
                onClick={() => setDownloadModal(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px]">Assigned Asset:</div>
                <div className="font-mono text-sm font-bold text-brand-300">{downloadModal.finalEditId}</div>
                <div className="text-slate-500 text-[10px]">
                  Target Page: {downloadModal.instructions?.targetPage} ({downloadModal.instructions?.platform})
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed">
                <strong>Security Policy:</strong> This access URL expires at{' '}
                {new Date(downloadModal.expiresAt).toLocaleTimeString()} (15 minutes). Direct download only. Do not forward or re-upload to unauthorized platforms.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setDownloadModal(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <a
                  href={downloadModal.downloadUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4 File</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
