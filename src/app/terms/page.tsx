import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-xs text-slate-300 leading-relaxed">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white">Platform Terms of Service</h1>
        <p className="text-slate-400">Version 1.0 • Reviewed Marketplace Terms Template</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">1. Nature of the Marketplace</h2>
        <p>
          Clipper operates a managed video editing and one-to-one distribution placement platform. Content creators contract the platform for editing services and placement facilitation. Registered distribution partners contract to publish approved finished video edits on their verified social channels.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">2. The ONE_EDIT_ONE_PAGE Principle</h2>
        <p>
          Each unique final video edit is mapped to exactly one social media page. Distribution partners agree not to copy, duplicate, or re-post the same creative to other accounts. The company enforces this restriction technically through database-level unique constraints and cryptographic hashes.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">3. Partner Non-Editing Covenant</h2>
        <p>
          Distribution partners covenant that they will not alter, trim, dub, or visually distort the approved final video asset delivered to them, unless explicitly instructed in writing in the campaign brief. Partners are compensated solely for authorized publication on the assigned page.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">4. No Guaranteed Performance or Virality</h2>
        <p>
          Neither party makes or receives any guarantee regarding viewer engagement, view counts, virality, algorithmic recommendation, platform monetization, or financial returns. All displayed metrics are historical observations with disclosed provenance.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">5. Intellectual Property & Rights Clearances</h2>
        <p>
          Content creators represent and warrant that they possess all legal rights, titles, and sync licenses required for commercial distribution of their footage. The platform reserves the right to immediately suspend or take down disputed content upon notice.
        </p>
      </div>
    </div>
  );
}
