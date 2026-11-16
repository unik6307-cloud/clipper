'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('creator@acme.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Switch to user matching email or default
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      const matched = data.allDemoUsers?.find((u: any) => u.email === email) || data.allDemoUsers?.[0];
      if (matched) {
        await fetch('/api/auth/switch-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: matched.id }),
        });
        if (matched.role === 'CONTENT_CREATOR') router.push('/creator/dashboard');
        else if (matched.role === 'DISTRIBUTION_PARTNER') router.push('/partner/dashboard');
        else if (matched.role === 'VIDEO_EDITOR') router.push('/team/editing');
        else if (matched.role === 'QUALITY_REVIEWER') router.push('/team/quality-review');
        else router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userId: string, targetPath: string) => {
    setLoading(true);
    try {
      await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      router.push(targetPath);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to Clipper</h1>
          <p className="text-xs text-slate-400">Access your creator studio, partner assignments, or team console</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher within Login Screen */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Or Fast-Sign In As A Test Persona:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => quickLogin('usr_creator_acme', '/creator/dashboard')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-colors"
              >
                <div className="font-semibold text-emerald-400">Content Creator</div>
                <div className="text-slate-500 text-[10px]">Sarah Lin (Acme)</div>
              </button>
              <button
                type="button"
                onClick={() => quickLogin('usr_partner_devnetwork', '/partner/dashboard')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-left transition-colors"
              >
                <div className="font-semibold text-indigo-400">Distro Partner</div>
                <div className="text-slate-500 text-[10px]">Marcus (DevNetwork)</div>
              </button>
              <button
                type="button"
                onClick={() => quickLogin('usr_editor_jordan', '/team/editing')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-colors"
              >
                <div className="font-semibold text-cyan-400">Video Editor</div>
                <div className="text-slate-500 text-[10px]">Jordan Rivera</div>
              </button>
              <button
                type="button"
                onClick={() => quickLogin('usr_admin_alex', '/admin/dashboard')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-left transition-colors"
              >
                <div className="font-semibold text-rose-400">Super Admin</div>
                <div className="text-slate-500 text-[10px]">Alex Chen</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Need an account?{' '}
          <Link href="/select-account-type" className="text-brand-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
