'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Play,
  RotateCcw,
} from 'lucide-react';
import { StatusPill, VerificationBadge } from '@/components/ui/StatusPill';
import { OneEditOnePageCallout } from '@/components/ui/AttributionNotice';

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);
  const [testRunning, setTestRunning] = useState(false);

  const loadAssignments = () => {
    fetch('/api/admin/assignments')
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.assignments || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // Run the acceptance test against the live backend API to prove ONE_EDIT_ONE_PAGE enforcement
  const handleTestDuplicateViolation = async () => {
    setTestRunning(true);
    setTestResult(null);

    try {
      // Pick EDIT-ACME-001 which is already assigned and published
      const res = await fetch('/api/assignments/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalEditId: 'EDIT-ACME-001', // Already assigned!
          socialPageId: 'page_codedaily_ig', // Attempt to assign to a second page
          agreedPriceCents: 15000,
        }),
      });

      const data = await res.json();

      setTestResult({
        statusCode: res.status,
        passed: res.status === 409,
        response: data,
      });
    } catch (err: any) {
      setTestResult({
        statusCode: 500,
        passed: false,
        response: { error: err.message },
      });
    } finally {
      setTestRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Distribution 1:1 Operations</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor one-to-one edit mappings, immutable lock statuses, publication proof links, and transactional integrity.
        </p>
      </div>

      <OneEditOnePageCallout />

      {/* Live Acceptance Test Tool */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-brand-500/40 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-400" />
              <h2 className="text-sm font-bold text-white">Interactive ONE_EDIT_ONE_PAGE Constraint Verifier</h2>
            </div>
            <p className="text-slate-400 text-[11px]">
              Simulate an attempt (even as an administrator) to assign an already-committed Edit ID (<code className="text-brand-300 font-mono">EDIT-ACME-001</code>) to a second social page.
            </p>
          </div>
          <button
            disabled={testRunning}
            onClick={handleTestDuplicateViolation}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-600/20 disabled:opacity-50 shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{testRunning ? 'Executing Test Call...' : 'Execute Duplicate Violation Test'}</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
              testResult.passed
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {testResult.passed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>TEST VERIFIED: HTTP {testResult.statusCode} CONFLICT (Correctly Blocked)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>TEST FAILED: HTTP {testResult.statusCode}</span>
                </>
              )}
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong>Backend Response:</strong> {testResult.response?.error || JSON.stringify(testResult.response)}
            </div>
            <div className="text-[10px] text-slate-400">
              Database schema constraint: <code>UNIQUE(finalEditId)</code> + Transaction check prevented race condition.
            </div>
          </div>
        )}
      </div>

      {/* Assignments Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 font-bold text-white uppercase tracking-wider text-[11px]">
          Committed 1:1 Placements Directory ({assignments.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-3.5">Final Edit ID</th>
                <th className="p-3.5">Campaign</th>
                <th className="p-3.5">Destination Channel</th>
                <th className="p-3.5">Partner Entity</th>
                <th className="p-3.5">Fee</th>
                <th className="p-3.5">Assignment Status</th>
                <th className="p-3.5">Live Post Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {assignments.map((asg) => {
                const page = asg.socialPage;
                const post = asg.publishedPost;
                return (
                  <tr key={asg.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-white font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-brand-400" />
                      <span>{asg.finalEditId}</span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-200 truncate max-w-[160px]">
                      {asg.finalEdit?.campaign?.title}
                    </td>
                    <td className="p-3.5 font-mono text-brand-300">
                      {page?.handle} ({page?.platform})
                    </td>
                    <td className="p-3.5 text-slate-400">{page?.partner?.businessName}</td>
                    <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                      ${(asg.agreedPriceCents / 100).toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <StatusPill status={asg.status} />
                    </td>
                    <td className="p-3.5">
                      {post ? (
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <a
                            href={post.publicPostUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-400 hover:underline flex items-center gap-1"
                          >
                            <span>Live Post</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <VerificationBadge level={post.verificationStatus} />
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">Pending Publication</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
