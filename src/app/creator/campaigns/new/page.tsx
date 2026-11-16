'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Shield,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { OneEditOnePageCallout } from '@/components/ui/AttributionNotice';

export default function NewCampaignWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: 'Episode 43: Next-Gen Vector Search with Pinecone Engineers',
    objective: 'BRAND_AWARENESS',
    contentNiche: 'Technology & AI',
    targetAudience: 'Software engineers, AI builders, database architects',
    targetPlatforms: ['YOUTUBE', 'INSTAGRAM', 'TIKTOK'],
    desiredEditsCount: 3,
    publishingWindowDays: 14,
    // Source Asset
    fileName: 'podcast_ep43_raw_4k.mp4',
    fileSizeBytes: 2800000000, // 2.8 GB
    durationSeconds: 3450, // 57 mins
    // Rights Declarations (Mandatory)
    ownsSourceContent: false,
    hasThirdPartyLicenses: false,
    permittedTerritories: 'Worldwide',
    permittedPlatforms: 'YouTube Shorts, Instagram Reels, TikTok',
    rightsNotes: 'Original master recording owned by Acme Media Labs with commercial sync rights cleared.',
  });

  // Calculate live itemized quote
  const perClipEditing = 120;
  const avgPlacement = 150;
  const editingSubtotal = formData.desiredEditsCount * perClipEditing;
  const placementSubtotal = formData.desiredEditsCount * avgPlacement;
  const platformFee = Math.round((editingSubtotal + placementSubtotal) * 0.1);
  const totalDue = editingSubtotal + placementSubtotal + platformFee;

  const togglePlatform = (p: string) => {
    if (formData.targetPlatforms.includes(p)) {
      if (formData.targetPlatforms.length > 1) {
        setFormData({
          ...formData,
          targetPlatforms: formData.targetPlatforms.filter((item) => item !== p),
        });
      }
    } else {
      setFormData({
        ...formData,
        targetPlatforms: [...formData.targetPlatforms, p],
      });
    }
  };

  const handleSubmitCampaign = async () => {
    if (!formData.ownsSourceContent) {
      setError('You must certify ownership or authorization of the source video before submitting.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      // Success -> Redirect to studio
      router.push('/creator/studio');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Wizard Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-mono font-semibold text-brand-400 uppercase tracking-wider">
          Campaign Launch Wizard
        </span>
        <h1 className="text-2xl font-bold text-white mt-1">Create Managed Short-Form Campaign</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete the 4-step configuration to queue your raw footage for editing and 1:1 distribution matching.
        </p>
      </div>

      <OneEditOnePageCallout />

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { num: 1, label: 'Upload Video' },
          { num: 2, label: 'Brief & Audience' },
          { num: 3, label: 'Rights Clearance' },
          { num: 4, label: 'Quote & Payment' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-xl border text-center transition-colors ${
              step === s.num
                ? 'bg-brand-950/60 border-brand-500 text-white font-semibold'
                : step > s.num
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-mono text-[11px] mb-0.5">Step {s.num}</div>
            <div className="truncate">{s.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: UPLOAD SOURCE VIDEO */}
      {step === 1 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-400" />
              <span>Step 1: Direct-to-Storage Video Upload</span>
            </h2>
            <p className="text-xs text-slate-400">
              Raw video binaries are uploaded directly to private object storage via presigned short-lived URLs.
            </p>
          </div>

          <div className="p-8 border-2 border-dashed border-slate-700 hover:border-brand-500/60 rounded-2xl bg-slate-950/60 text-center space-y-3 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto">
              <FileVideo className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{formData.fileName}</div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                Size: {(formData.fileSizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB • Duration:{' '}
                {Math.round(formData.durationSeconds / 60)} minutes • Format: MP4
              </div>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Validated & Checksum Generated (SHA-256)
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
            >
              <span>Next: Brief & Audience</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BRIEF & AUDIENCE */}
      {step === 2 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Step 2: Campaign Objective & Target Audience</span>
            </h2>
            <p className="text-xs text-slate-400">
              This data guides both the video editor’s hook selection and the AI page recommendation scoring.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Campaign Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Content Niche</label>
                <select
                  value={formData.contentNiche}
                  onChange={(e) => setFormData({ ...formData, contentNiche: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Technology & AI">Technology & AI</option>
                  <option value="Business & Startups">Business & Startups</option>
                  <option value="Finance & Investing">Finance & Investing</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Education & Science">Education & Science</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Number of Desired Short Edits</label>
                <select
                  value={formData.desiredEditsCount}
                  onChange={(e) => setFormData({ ...formData, desiredEditsCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value={1}>1 Edit (1 Unique Page)</option>
                  <option value={2}>2 Edits (2 Unique Pages)</option>
                  <option value={3}>3 Edits (3 Unique Pages)</option>
                  <option value={5}>5 Edits (5 Unique Pages)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Audience Profile</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Target Distribution Platforms</label>
              <div className="flex gap-2">
                {['YOUTUBE', 'INSTAGRAM', 'TIKTOK'].map((platform) => {
                  const isSelected = formData.targetPlatforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                        isSelected
                          ? 'bg-brand-600/20 border-brand-500 text-brand-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {platform === 'YOUTUBE' ? 'YouTube Shorts' : platform === 'INSTAGRAM' ? 'Instagram Reels' : 'TikTok'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
            >
              <span>Next: Rights Clearance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RIGHTS CLEARANCE */}
      {step === 3 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Step 3: Rights Certification & Licensing Declaration</span>
            </h2>
            <p className="text-xs text-slate-400">
              Mandatory legal requirement before editing or distribution can begin.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ownsSourceContent}
                  onChange={(e) => setFormData({ ...formData, ownsSourceContent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                />
                <div className="space-y-1">
                  <span className="font-semibold text-slate-200">
                    Source Content Ownership Certification (Mandatory)
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    I represent and warrant that I am the author, copyright owner, or authorized commercial licensee of the uploaded source footage, including all visual, spoken, and auditory elements.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer border-t border-slate-800/80 pt-3">
                <input
                  type="checkbox"
                  checked={formData.hasThirdPartyLicenses}
                  onChange={(e) => setFormData({ ...formData, hasThirdPartyLicenses: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                />
                <div className="space-y-1">
                  <span className="font-semibold text-slate-200">
                    Third-Party Commercial Audio & Sync Licensing
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Any included background music or B-roll assets are licensed for commercial digital synchronization across social platforms.
                  </p>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Permitted Territories</label>
                <input
                  type="text"
                  value={formData.permittedTerritories}
                  onChange={(e) => setFormData({ ...formData, permittedTerritories: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Permitted Platforms</label>
                <input
                  type="text"
                  value={formData.permittedPlatforms}
                  onChange={(e) => setFormData({ ...formData, permittedPlatforms: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              disabled={!formData.ownsSourceContent}
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next: Review Quote & Pay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: QUOTE & PAYMENT */}
      {step === 4 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Step 4: Itemized Quote & Payment Authorization</span>
            </h2>
            <p className="text-xs text-slate-400">
              Clear unbundled quote separating production costs from distribution placement fees.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-brand-500/30 space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Internal Video Editing ({formData.desiredEditsCount}x Clips @ $120.00)</span>
              <span className="font-mono text-white font-semibold">${editingSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Distribution Placements ({formData.desiredEditsCount}x Unique Pages ~ $150.00)</span>
              <span className="font-mono text-white font-semibold">${placementSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Platform Service Commission (10%)</span>
              <span className="font-mono text-white font-semibold">${platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
              <span>Estimated Taxes</span>
              <span className="font-mono">$0.00</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-slate-800 pt-3">
              <span className="text-sm font-bold text-white">Total Authorized Due</span>
              <span className="text-2xl font-mono font-bold text-brand-400">${totalDue.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-300">Protected Marketplace Workflow</div>
              <p className="text-emerald-300/80 text-[11px] mt-0.5">
                Placements are held until you approve each draft cut in your Studio. Distribution partners are only paid after verified publication.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              disabled={loading}
              onClick={handleSubmitCampaign}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <span>{loading ? 'Processing Authorization...' : 'Authorize & Launch Campaign'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
