'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Video, Share2, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-xl p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-center text-xs">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Welcome to Clipper</h1>
          <p className="text-slate-400">Your profile has been created. What would you like to do first?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <Link
            href="/creator/campaigns/new"
            className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-brand-500 transition-colors space-y-2 block"
          >
            <Video className="w-5 h-5 text-brand-400" />
            <div className="font-bold text-white text-sm">Upload Long-Form Video</div>
            <p className="text-[11px] text-slate-400">Launch a campaign to turn raw footage into unique vertical shorts.</p>
          </Link>

          <Link
            href="/partner/pages/new"
            className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 transition-colors space-y-2 block"
          >
            <Share2 className="w-5 h-5 text-indigo-400" />
            <div className="font-bold text-white text-sm">Register Social Channels</div>
            <p className="text-[11px] text-slate-400">Add YouTube Shorts, Reels, or TikTok pages for paid publishing assignments.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
