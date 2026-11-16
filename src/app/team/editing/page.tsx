'use client';

import React, { useState, useEffect } from 'react';
import { Scissors, Upload, Play, CheckCircle2, AlertCircle, Film, ArrowRight } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function TeamEditingWorkspacePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [clipForm, setClipForm] = useState({
    title: 'Clip 4: Why Distributed Inference is 10x Cheaper in 2026',
    hookDescription: 'Why smart AI engineers are abandoning giant centralized clusters',
    captionText: 'Decentralized compute won. Here is how edge nodes cut latency by 80%. #ai #engineering #coding',
    draftUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    aspectRatio: '9:16',
    durationSeconds: 48,
    editorNotes: 'Color graded for mobile contrast. Added animated kinetic captions and normalized audio to -14 LUFS.',
  });

  const loadTasks = () => {
    fetch('/api/editor/tasks')
      .then((res) => res.json())
      .then((data) => {
        const list = data.tasks || [];
        setTasks(list);
        if (list.length > 0 && !selectedTaskId) {
          setSelectedTaskId(list[0].id);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleUploadDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) return;

    setUploadLoading(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/editor/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editingTaskId: selectedTaskId,
          ...clipForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMsg(data.message);
      loadTasks();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Editor Production Workspace</h1>
        <p className="text-xs text-slate-400 mt-1">
          Internal editing studio: turn raw footage into high-hook 9:16 vertical edits for quality review.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Task & Source Asset Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Assigned Editing Tasks ({tasks.length})
          </div>

          <div className="space-y-2">
            {tasks.map((task) => {
              const isSelected = task.id === selectedTaskId;
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-cyan-400 font-bold">
                      Task #{task.id.slice(-6).toUpperCase()}
                    </span>
                    <StatusPill status={task.status} />
                  </div>
                  <div className="text-xs font-semibold text-white truncate">
                    {task.campaign?.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Target: {task.targetClipsCount} vertical clips • Source: {task.sourceAsset?.fileName}
                  </div>
                </button>
              );
            })}
          </div>

          {currentTask && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="font-bold text-white text-sm">Campaign Brief Notes</div>
              <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-950 p-3 rounded-lg border border-slate-800">
                {currentTask.internalNotes || 'Produce 3 punchy hooks focusing on founder advice.'}
              </p>
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div>Objective: {currentTask.campaign?.objective}</div>
                <div>Target Audience: {currentTask.campaign?.targetAudience}</div>
                <div>Platforms: {currentTask.campaign?.targetPlatforms}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Upload Draft Clip Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload New Draft Cut for QA Review</span>
            </h2>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Submit finished vertical edit with narrative hook and prepared subtitles.
            </p>
          </div>

          <form onSubmit={handleUploadDraft} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Clip Title</label>
              <input
                type="text"
                required
                value={clipForm.title}
                onChange={(e) => setClipForm({ ...clipForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Narrative Hook (0:00 - 0:03)</label>
              <input
                type="text"
                required
                value={clipForm.hookDescription}
                onChange={(e) => setClipForm({ ...clipForm, hookDescription: e.target.value })}
                placeholder="Why 90% of developers fail their first backend benchmark..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Prepared Caption & Hashtags</label>
              <textarea
                rows={2}
                value={clipForm.captionText}
                onChange={(e) => setClipForm({ ...clipForm, captionText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Aspect Ratio</label>
                <select
                  value={clipForm.aspectRatio}
                  onChange={(e) => setClipForm({ ...clipForm, aspectRatio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="9:16">9:16 Vertical (Shorts/Reels/TikTok)</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="4:5">4:5 Feed Vertical</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Duration (Seconds)</label>
                <input
                  type="number"
                  min="15"
                  max="60"
                  value={clipForm.durationSeconds}
                  onChange={(e) => setClipForm({ ...clipForm, durationSeconds: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Internal Notes for QA Reviewer</label>
              <textarea
                rows={2}
                value={clipForm.editorNotes}
                onChange={(e) => setClipForm({ ...clipForm, editorNotes: e.target.value })}
                placeholder="Mention audio adjustments, cuts, or graphic treatments..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={uploadLoading || !selectedTaskId}
                className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20 disabled:opacity-50"
              >
                <span>{uploadLoading ? 'Uploading Draft...' : 'Submit Draft for QA Gate'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
