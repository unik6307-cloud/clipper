'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Send, FileText } from 'lucide-react';

export default function CopyrightPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    claimantName: '',
    claimantEmail: '',
    ownerType: 'COPYRIGHT_OWNER',
    infringingUrl: '',
    originalWorkDescription: '',
    signature: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.claimantName || !formData.claimantEmail || !formData.infringingUrl) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          Intellectual Property & DMCA
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Copyright Infringement & Takedown Notices
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Clipper respects intellectual property rights. If you believe your copyrighted work has been utilized in an edit or published without authorization, submit a notice below for immediate operational review.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Takedown Request Logged</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Notice logged under reference #{Math.random().toString(36).substring(2, 9).toUpperCase()}. Our compliance team investigates and pauses disputed campaign placements immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Claimant Name</label>
                <input
                  type="text"
                  required
                  value={formData.claimantName}
                  onChange={(e) => setFormData({ ...formData, claimantName: e.target.value })}
                  placeholder="Full Legal Name"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={formData.claimantEmail}
                  onChange={(e) => setFormData({ ...formData, claimantEmail: e.target.value })}
                  placeholder="legal@rightsowner.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Infringing URL / Post ID / Edit ID</label>
              <input
                type="text"
                required
                value={formData.infringingUrl}
                onChange={(e) => setFormData({ ...formData, infringingUrl: e.target.value })}
                placeholder="https://youtube.com/shorts/... or EDIT-XXXX"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Description of Original Work & Proof</label>
              <textarea
                required
                rows={3}
                value={formData.originalWorkDescription}
                onChange={(e) => setFormData({ ...formData, originalWorkDescription: e.target.value })}
                placeholder="Link to original publication, copyright registration number, or rights license..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Digital Signature</label>
              <input
                type="text"
                required
                value={formData.signature}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                placeholder="Type your full legal name as digital signature"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Submit Formal DMCA Notice</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
