'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Clock, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'CREATOR_SUPPORT',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
          Support & Communications
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Get In Touch With Operations
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Have an inquiry about an active campaign, partner registration, or custom enterprise requirements?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 space-y-6 text-xs text-slate-300">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-brand-400 font-semibold">
              <Clock className="w-4 h-4" />
              <span>Operational SLAs</span>
            </div>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>• Creator campaign briefs reviewed within <strong>4 business hours</strong>.</li>
              <li>• Partner page verification completed within <strong>12 hours</strong>.</li>
              <li>• Priority support for active publishing windows.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Mail className="w-4 h-4" />
              <span>Direct Inboxes</span>
            </div>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <div><strong>Creators:</strong> creators@clipper.internal</div>
              <div><strong>Partners:</strong> partners@clipper.internal</div>
              <div><strong>DMCA & Copyright:</strong> legal@clipper.internal</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Message Dispatched</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Thank you, {formData.name}. Your inquiry has been routed to our {formData.department.replace(/_/g, ' ')} queue. An operations specialist will reply shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs text-brand-400 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="CREATOR_SUPPORT">Creator Campaigns & Studio</option>
                  <option value="PARTNER_ONBOARDING">Distribution Partner Verification</option>
                  <option value="FINANCE_BILLING">Billing & Payout Settlement</option>
                  <option value="LEGAL_COPYRIGHT">Copyright / DMCA Takedown</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide context or campaign identifiers..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
