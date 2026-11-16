'use client';

import React, { useState } from 'react';
import { Settings, Shield, CheckCircle2, User, CreditCard } from 'lucide-react';

export default function PartnerSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    businessName: 'DevNetwork Media LLC',
    contactEmail: 'partner@devnetwork.media',
    country: 'United States',
    taxStatus: 'W9_VERIFIED',
    payoutMethod: 'STRIPE_CONNECTED',
    payoutAccount: 'acct_1NZ4920492849203',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Partner Settings & Payout Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your publishing entity, tax compliance verification, and payout account connection.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Partner preferences saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Business / Publisher Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Operating Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Tax Classification</label>
            <input
              type="text"
              disabled
              value="W-9 Certified (EIN Verified)"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Connected Marketplace Payout Account</span>
          </div>
          <div className="text-slate-400 text-[11px] font-mono">
            Stripe Account ID: {formData.payoutAccount} (Active)
          </div>
          <p className="text-slate-500 text-[10px]">
            To modify bank accounts or update identity documentation, use the Stripe Express dashboard.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md"
        >
          Save Partner Settings
        </button>
      </form>
    </div>
  );
}
