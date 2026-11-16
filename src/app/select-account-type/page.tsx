import React from 'react';
import Link from 'next/link';
import { Video, Share2, ArrowRight } from 'lucide-react';

export default function SelectAccountTypePage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Join the Clipper Marketplace</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Select how you plan to participate in short-form production and distribution</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/register?type=creator"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500 transition-all space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">I Need Edits & Distribution</h2>
              <p className="text-xs text-slate-400 mt-1">
                Content creator, podcaster, or media publisher looking to convert raw footage into high-hook shorts and single-channel distribution.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400">
              <span>Sign up as Creator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/register?type=partner"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 transition-all space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">I Own Social Pages</h2>
              <p className="text-xs text-slate-400 mt-1">
                Owner or manager of YouTube Shorts, Instagram Reels, or TikTok pages looking to accept paid publishing assignments without editing.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
              <span>Sign up as Distribution Partner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
