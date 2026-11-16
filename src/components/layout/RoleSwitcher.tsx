'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Check, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl?: string | null;
}

const ROLE_LABELS: Record<string, { label: string; tag: string; defaultPath: string; color: string }> = {
  CONTENT_CREATOR: {
    label: 'Content Creator',
    tag: 'Acme Media Labs',
    defaultPath: '/creator/dashboard',
    color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  },
  DISTRIBUTION_PARTNER: {
    label: 'Distribution Partner',
    tag: 'DevNetwork Media',
    defaultPath: '/partner/dashboard',
    color: 'border-indigo-500/40 text-indigo-300 bg-indigo-500/10',
  },
  VIDEO_EDITOR: {
    label: 'Video Editor (Internal)',
    tag: 'Production Team',
    defaultPath: '/team/editing',
    color: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
  },
  QUALITY_REVIEWER: {
    label: 'Quality Reviewer (Internal)',
    tag: 'QA Team',
    defaultPath: '/team/quality-review',
    color: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
  },
  SUPER_ADMIN: {
    label: 'Super Admin',
    tag: 'Operations & Exec',
    defaultPath: '/admin/dashboard',
    color: 'border-rose-500/40 text-rose-300 bg-rose-500/10',
  },
  OPERATIONS_ADMIN: {
    label: 'Operations Admin',
    tag: 'Operations',
    defaultPath: '/admin/dashboard',
    color: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
  },
  FINANCE_MANAGER: {
    label: 'Finance Manager',
    tag: 'Ledger & Payouts',
    defaultPath: '/admin/finance',
    color: 'border-teal-500/40 text-teal-300 bg-teal-500/10',
  },
};

export function RoleSwitcher() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [allUsers, setAllUsers] = useState<DemoUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
        if (data.allDemoUsers) setAllUsers(data.allDemoUsers);
      })
      .catch((err) => console.error('Failed to load user state', err));
  }, []);

  const handleSwitch = async (targetUser: DemoUser) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUser.id }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(targetUser);
        setIsOpen(false);
        const meta = ROLE_LABELS[targetUser.role];
        const dest = meta?.defaultPath || '/';
        router.push(dest);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentMeta = currentUser ? ROLE_LABELS[currentUser.role] : null;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-slate-500 transition-colors text-xs text-slate-200 shadow-sm"
        title="Switch simulated perspective"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium text-slate-400">View As:</span>
        <span className="font-semibold text-white truncate max-w-[140px]">
          {currentUser?.name || 'Switch Role'}
        </span>
        {currentMeta && (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${currentMeta.color}`}>
            {currentMeta.label.split(' ')[0]}
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl z-50 p-2 text-xs">
            <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-400" />
                <span>Simulated Role Switcher</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Instant Demo</span>
            </div>

            <div className="py-1 max-h-80 overflow-y-auto space-y-1">
              {allUsers.map((u) => {
                const meta = ROLE_LABELS[u.role] || {
                  label: u.role,
                  tag: 'Internal',
                  defaultPath: '/',
                  color: 'border-zinc-700 text-zinc-300',
                };
                const isSelected = currentUser?.id === u.id;

                return (
                  <button
                    key={u.id}
                    onClick={() => handleSwitch(u)}
                    disabled={loading}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-brand-950/60 border border-brand-500/40 text-white'
                        : 'hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100">{u.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${meta.color}`}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-800 bg-slate-950/50 rounded-b-lg text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>Full RBAC & Resource Ownership Enforced in API</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
