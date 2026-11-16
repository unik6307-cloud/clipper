import React from 'react';
import { PartnerSidebar } from '@/components/layout/PartnerSidebar';

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <PartnerSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
