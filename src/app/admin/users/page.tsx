'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, CheckCircle2, UserX, UserCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, status: newStatus }),
      });
      if (res.ok) loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User & Role Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            RBAC permissions, organization memberships, creator accounts, and partner profiles.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
        >
          <option value="ALL">All Roles</option>
          <option value="CONTENT_CREATOR">Content Creators</option>
          <option value="DISTRIBUTION_PARTNER">Distribution Partners</option>
          <option value="VIDEO_EDITOR">Video Editors</option>
          <option value="QUALITY_REVIEWER">Quality Reviewers</option>
          <option value="SUPER_ADMIN">Super Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Profile Info</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Joined</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{u.email}</div>
                  </td>
                  <td className="p-3.5 font-mono text-brand-300 font-semibold">{u.role}</td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {u.creatorProfile ? `Brand: ${u.creatorProfile.brandName}` : u.partnerProfile ? `Partner: ${u.partnerProfile.businessName}` : 'Internal Staff'}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/40'
                          : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/40'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
