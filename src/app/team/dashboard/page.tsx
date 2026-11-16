'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scissors,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Film,
} from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function TeamDashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/editor/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Internal Production & QA Hub</h1>
        <p className="text-xs text-slate-400 mt-1">
          Control editing task queues, vertical re-framing, caption accuracy, and quality review checkpoints.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Editing Queue Tasks</span>
          <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">{tasks.length}</div>
          <span className="text-[10px] text-slate-500">Assigned Editors</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Quality Checks Pending</span>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1">2</div>
          <span className="text-[10px] text-slate-500">Audio & Caption QA</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Creator Approvals</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">3</div>
          <span className="text-[10px] text-slate-500">Final Edit IDs Active</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Turnaround SLA</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">100%</div>
          <span className="text-[10px] text-emerald-400">On-Time Delivery</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editor Workspace Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Video Editor Queue</h2>
            </div>
            <Link href="/team/editing" className="text-xs text-cyan-400 hover:underline font-semibold">
              Open Workspace
            </Link>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Access assigned raw recordings, review creator hook guidelines, and upload new draft clip versions with animated subtitles and audio grading.
          </p>
          <Link
            href="/team/editing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md"
          >
            <span>Start Editing Next Clip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quality Review Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Quality Review (QA) Gate</h2>
            </div>
            <Link href="/team/quality-review" className="text-xs text-amber-400 hover:underline font-semibold">
              Open Review Queue
            </Link>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Verify aspect ratio (9:16), audio LUFS normalization (-14 LUFS standard), hook engagement score, brand guidelines, and rights compliance before creator review.
          </p>
          <Link
            href="/team/quality-review"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md"
          >
            <span>Open QA Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
