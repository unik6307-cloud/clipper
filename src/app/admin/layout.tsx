import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
