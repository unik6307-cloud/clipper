import React from 'react';
import { CreatorSidebar } from '@/components/layout/CreatorSidebar';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <CreatorSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
