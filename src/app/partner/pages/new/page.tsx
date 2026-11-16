'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function NewPartnerPageRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<any>(null);

  const [formData, setFormData] = useState({
    platform: 'YOUTUBE',
    handle: '@CodeDailyShorts',
    pageName: 'CodeDaily Shorts',
    profileUrl: 'https://youtube.com/@CodeDailyShorts',
    niche: 'Technology & AI',
    primaryLanguage: 'English',
    audienceMarkets: 'United States (60%), UK (15%), Canada (10%)',
    placementPriceCents: 16000, // $160.00
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/partner/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setChallenge(data.verificationChallenge);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Register Social Channel</h1>
        <p className="text-xs text-slate-400 mt-1">
          Add your YouTube Shorts, Instagram Reels, or TikTok channel to the Clipper distribution directory.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {challenge ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-white">Channel Profile Created</h2>
            <p className="text-slate-400">Complete non-invasive ownership verification to start receiving paid invitations.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-slate-300 font-semibold">Verification Step: Bio Code Challenge</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Place the temporary code below anywhere in your profile bio or about description on {formData.handle}. Our crawler verifies channel ownership without requiring social passwords.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-brand-500/40 font-mono text-center text-sm font-bold text-brand-300 select-all">
              {challenge.code}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => router.push('/partner/pages')}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md"
            >
              Return to My Social Pages
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Social Media Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {['YOUTUBE', 'INSTAGRAM', 'TIKTOK'].map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setFormData({ ...formData, platform: plat })}
                  className={`p-3 rounded-xl border text-center font-mono font-semibold transition-colors ${
                    formData.platform === plat
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Channel / Page Handle</label>
              <input
                type="text"
                required
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Public Display Name</label>
              <input
                type="text"
                required
                value={formData.pageName}
                onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Profile / Channel URL</label>
            <input
              type="url"
              required
              value={formData.profileUrl}
              onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Content Niche</label>
              <select
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Technology & AI">Technology & AI</option>
                <option value="Business & Startups">Business & Startups</option>
                <option value="Finance & Investing">Finance & Investing</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Education & Science">Education & Science</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Placement Fee ($ USD / post)</label>
              <input
                type="number"
                min="50"
                max="1000"
                step="10"
                value={formData.placementPriceCents / 100}
                onChange={(e) =>
                  setFormData({ ...formData, placementPriceCents: Number(e.target.value) * 100 })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
            Security Note: Clipper never asks for social media passwords. We use official platform APIs or public bio codes for ownership verification.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <span>{loading ? 'Registering...' : 'Register Channel Profile'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
