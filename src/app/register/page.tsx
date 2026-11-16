'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Video, Share2, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'partner' ? 'DISTRIBUTION_PARTNER' : 'CONTENT_CREATOR';

  const [role, setRole] = useState(initialType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brandOrBusiness, setBrandOrBusiness] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Switch to existing creator or partner demo user to complete onboarding
    const targetUserId = role === 'DISTRIBUTION_PARTNER' ? 'usr_partner_devnetwork' : 'usr_creator_acme';
    await fetch('/api/auth/switch-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: targetUserId }),
    });

    if (role === 'DISTRIBUTION_PARTNER') {
      router.push('/partner/pages/new');
    } else {
      router.push('/creator/campaigns/new');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Your Clipper Account</h1>
        <p className="text-xs text-slate-400">Join the managed short-form production and 1:1 distribution marketplace</p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 text-xs">
        {/* Account Role Selector */}
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Account Role</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('CONTENT_CREATOR')}
              className={`p-3 rounded-xl border text-center transition-colors flex items-center justify-center gap-2 font-medium ${
                role === 'CONTENT_CREATOR'
                  ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Video className="w-4 h-4 text-brand-400" />
              <span>Creator / Brand</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('DISTRIBUTION_PARTNER')}
              className={`p-3 rounded-xl border text-center transition-colors flex items-center justify-center gap-2 font-medium ${
                role === 'DISTRIBUTION_PARTNER'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Distro Partner</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Lin"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@acme.io"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {role === 'DISTRIBUTION_PARTNER' ? 'Publisher / Agency Name' : 'Company / Brand Name'}
            </label>
            <input
              type="text"
              required
              value={brandOrBusiness}
              onChange={(e) => setBrandOrBusiness(e.target.value)}
              placeholder={role === 'DISTRIBUTION_PARTNER' ? 'DevNetwork Media' : 'Acme Media Labs'}
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
              placeholder="••••••••••••"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Onboarding'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link href="/login" className="text-brand-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
