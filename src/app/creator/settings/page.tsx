'use client';

import React, { useState } from 'react';
import { Settings, Shield, User, Download, Trash2, CheckCircle2 } from 'lucide-react';

export default function CreatorSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    brandName: 'Acme Media Labs',
    website: 'https://acme.io',
    targetNiche: 'Technology & AI',
    defaultTerritory: 'Worldwide',
    defaultPlatforms: 'YouTube Shorts, Instagram Reels, TikTok',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile & Rights Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your organization profile, default licensing scopes, and data privacy controls.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
        <div className="font-bold text-sm text-white border-b border-slate-800 pb-2">
          Organization & Brand Profile
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Brand / Channel Name</label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Official Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Primary Content Niche</label>
          <input
            type="text"
            value={formData.targetNiche}
            onChange={(e) => setFormData({ ...formData, targetNiche: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="font-bold text-sm text-white border-b border-slate-800 pb-2 pt-2">
          Default Licensing Scope
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Territory</label>
            <input
              type="text"
              value={formData.defaultTerritory}
              onChange={(e) => setFormData({ ...formData, defaultTerritory: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Approved Platforms</label>
            <input
              type="text"
              value={formData.defaultPlatforms}
              onChange={(e) => setFormData({ ...formData, defaultPlatforms: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors shadow-md"
        >
          Save Profile Preferences
        </button>
      </form>

      {/* Data Governance & Account Rights */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
        <div className="font-bold text-sm text-white border-b border-slate-800 pb-2">
          Data Export & Privacy Rights
        </div>
        <p className="text-slate-400 leading-relaxed">
          In accordance with privacy and platform policies, you can export your campaign records, audit trails, and financial statements at any time.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => alert('Exporting all organization data (JSON)...')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Organization Data</span>
          </button>
          <button
            onClick={() => alert('Account closure request submitted to compliance.')}
            className="px-4 py-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 font-medium flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Request Account Deletion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
