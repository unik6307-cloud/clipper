import React from 'react';

export function VerificationBadge({
  level,
  provenance,
  showIcon = true,
}: {
  level?: string;
  provenance?: string;
  showIcon?: boolean;
}) {
  const normalized = (level || provenance || 'UNVERIFIED').toUpperCase();

  switch (normalized) {
    case 'API_VERIFIED':
    case 'PLATFORM_API':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          API Verified
        </span>
      );
    case 'MANUAL_VERIFIED':
    case 'MANUAL_REVIEW_APPROVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
          Reviewer Verified
        </span>
      );
    case 'PARTNER_SUBMITTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
          Partner Submitted
        </span>
      );
    case 'ESTIMATED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
          Estimated (Not Verified)
        </span>
      );
    case 'PENDING_REVIEW':
    case 'PENDING_VERIFICATION':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          Pending Review
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/30">
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />}
          Unverified
        </span>
      );
  }
}

export function StatusPill({ status }: { status: string }) {
  const norm = (status || '').toUpperCase();

  const colors: Record<string, string> = {
    // Campaign & Edit
    DRAFT: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    BRIEF_SUBMITTED: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    PAID: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    EDITING_QUEUED: 'bg-blue-950 text-blue-300 border-blue-800',
    EDITING_IN_PROGRESS: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    QUALITY_REVIEW: 'bg-amber-950 text-amber-300 border-amber-800',
    CREATOR_REVIEW: 'bg-purple-950 text-purple-300 border-purple-800',
    APPROVED_FINAL: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    AVAILABLE_FOR_MATCHING: 'bg-sky-950 text-sky-300 border-sky-800',
    ASSIGNED_LOCKED: 'bg-teal-950 text-teal-300 border-teal-800',
    READY_FOR_DISTRIBUTION: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    DISTRIBUTION_IN_PROGRESS: 'bg-blue-950 text-blue-300 border-blue-800',
    VERIFIED_PUBLISHED: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    PUBLISHED_TRACKING: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    COMPLETED: 'bg-zinc-800 text-zinc-200 border-zinc-600',
    DISPUTED: 'bg-rose-950 text-rose-300 border-rose-800',
    CANCELLED: 'bg-zinc-900 text-zinc-400 border-zinc-700',

    // Assignment & Invitation
    PARTNER_INVITED: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    PARTNER_ACCEPTED: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    ASSET_ACCESS_GRANTED: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    SUBMITTED_FOR_VERIFICATION: 'bg-amber-950 text-amber-300 border-amber-800',
  };

  const styling = colors[norm] || 'bg-zinc-800 text-zinc-300 border-zinc-700';
  const label = norm.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styling}`}
    >
      {label}
    </span>
  );
}
