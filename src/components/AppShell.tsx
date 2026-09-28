'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Footer from './Footer';

interface AppShellProps {
  topics: Array<{
    name: string;
    slug: string;
    icon?: string | null;
    _count?: { deals: number };
  }>;
  categoryCounts: {
    freebies: number;
    discounts: number;
    trials: number;
    credits: number;
    promoCodes: number;
  };
  children: React.ReactNode;
}

export default function AppShell({ topics, categoryCounts, children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors">
      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        <Sidebar categoryCounts={categoryCounts} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] bg-white dark:bg-[#09090b] h-full shadow-2xl z-10 flex flex-col">
            <Sidebar categoryCounts={categoryCounts} onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        <TopNavbar
          topics={topics}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
