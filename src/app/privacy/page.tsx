import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-xs text-slate-300 leading-relaxed">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white">Privacy & Platform Data Policy</h1>
        <p className="text-slate-400">Version 1.0 • Privacy Policy Template</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">1. Strict No-Password Guarantee</h2>
        <p>
          Clipper never collects, requests, stores, or transmits your social-media platform passwords. Account verification is conducted exclusively via official OAuth 2.0 authorization flows (YouTube Data API, Meta Graph API, TikTok Display API) or non-invasive public bio verification codes.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">2. Token Security & Encryption</h2>
        <p>
          All API access and refresh tokens are encrypted at rest using AES-256 envelope encryption. Tokens are utilized solely for permitted read-only metric syncing and channel ownership verification in accordance with each platform’s developer policy.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">3. Metric Provenance & Transparency</h2>
        <p>
          We do not scrape or bypass platform rate limits or login gates. Private analytics remain strictly within the account owner’s domain and are never commingled into cross-network advertising pools without express consent.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">4. Data Deletion & Disconnection</h2>
        <p>
          Partners and creators may disconnect social integrations or request complete data deletion at any time via Account Settings or by contacting legal@clipper.internal.
        </p>
      </div>
    </div>
  );
}
