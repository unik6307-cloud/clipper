'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleSwitcher } from './RoleSwitcher';
import { Video, Shield, Sparkles, LayoutDashboard, Film, Share2, DollarSign } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/for-') ||
    pathname === '/how-it-works' ||
    pathname === '/pricing' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/faq' ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname === '/copyright';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Video className="w-4 h-4 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">Clipper</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
                  1:1 Distro
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">AI-Assisted Short Production</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/how-it-works"
              className={`transition-colors ${
                pathname === '/how-it-works' ? 'text-brand-400 font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/for-creators"
              className={`transition-colors ${
                pathname === '/for-creators' ? 'text-brand-400 font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              For Creators
            </Link>
            <Link
              href="/for-distribution-partners"
              className={`transition-colors ${
                pathname === '/for-distribution-partners'
                  ? 'text-brand-400 font-medium'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              For Partners
            </Link>
            <Link
              href="/pricing"
              className={`transition-colors ${
                pathname === '/pricing' ? 'text-brand-400 font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right Actions & Portals */}
        <div className="flex items-center gap-3">
          {/* Quick Portal Jump based on current path */}
          <div className="hidden lg:flex items-center gap-2 border-r border-slate-800 pr-3 mr-1 text-xs text-slate-400">
            <Link
              href="/creator/dashboard"
              className="px-2.5 py-1 rounded-md hover:bg-slate-800/80 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Creator</span>
            </Link>
            <Link
              href="/partner/dashboard"
              className="px-2.5 py-1 rounded-md hover:bg-slate-800/80 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Partner</span>
            </Link>
            <Link
              href="/team/editing"
              className="px-2.5 py-1 rounded-md hover:bg-slate-800/80 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>Team</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="px-2.5 py-1 rounded-md hover:bg-slate-800/80 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Role Switcher */}
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
