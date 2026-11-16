'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { OneEditOnePageCallout, AttributionNotice } from '@/components/ui/AttributionNotice';

export default function FAQPage() {
  const faqs = [
    {
      q: 'What is the ONE_EDIT_ONE_PAGE non-negotiable rule?',
      a: 'One finalised unique edit maps to exactly ONE distribution partner page for its entire lifecycle. Once an Edit ID is approved and committed to a destination channel, our database unique constraint and service locks prevent any second assignment. This guarantees exclusivity and prevents duplicate algorithmic spam.',
    },
    {
      q: 'Do distribution partners edit or modify videos?',
      a: 'No. Distribution partners never edit videos or touch raw source files. The platform’s internal production team handles all cuts, hooks, subtitles, and export formats. Distribution partners only publish the approved creative on their assigned page and submit the live URL for verification.',
    },
    {
      q: 'Do you guarantee view counts, virality, or conversions?',
      a: 'No. We explicitly do not promise guaranteed views, viral outcomes, or platform monetization. All metrics displayed in recommendation cards represent observed historical snapshots with explicit source attribution (API verified, partner submitted, or estimated sample size). We never sell fake views.',
    },
    {
      q: 'How does ownership and copyright licensing work?',
      a: 'Before any campaign begins production, the creator must sign a rights declaration certifying that they own or are authorized to commercially license the source content. We capture an immutable rights snapshot linked to the final Edit ID. Disputed content can be reported via our DMCA copyright portal.',
    },
    {
      q: 'How are destination social pages selected?',
      a: 'Our deterministic AI matching engine scores candidate pages across 7 dimensions: Niche relevance (25%), Median views & consistency (20%), Audience compatibility (15%), Price fit (15%), Cadence (10%), Delivery history (10%), and Verification completeness (5%). The creator reviews recommendations and explicitly approves the destination page.',
    },
    {
      q: 'When and how do distribution partners receive payouts?',
      a: 'Payout eligibility is triggered as soon as the partner submits the live public post URL and the URL is verified via official platform API or QA review. Payouts are settled through Stripe Connect or marketplace ledger transfers directly to the partner’s registered bank account.',
    },
    {
      q: 'What happens if a partner accepts an assignment but fails to publish?',
      a: 'If a partner fails to submit a verified public URL within their publishing window (typically 3–5 days), the assignment is marked failed. The creator is issued a replacement placement or refund. The original Edit ID is never silently assigned to someone else; a distinct approved edit version is generated.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Clear Answers On How Clipper Works
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Everything you need to know about our editing workflow, 1:1 distribution, analytics limitations, and payments.
        </p>
      </div>

      <OneEditOnePageCallout />

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4.5 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-100 hover:text-brand-300 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-brand-400 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                )}
              </button>
              {isOpen && (
                <div className="p-4.5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AttributionNotice />
    </div>
  );
}
