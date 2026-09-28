'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import ParadoxLogo from './ParadoxLogo';
import { useState } from 'react';

interface SidebarProps {
  categoryCounts?: {
    freebies: number;
    discounts: number;
    trials: number;
    credits: number;
    promoCodes: number;
  };
  onClose?: () => void;
}

export default function Sidebar({
  categoryCounts = {
    freebies: 10,
    discounts: 8,
    trials: 7,
    credits: 10,
    promoCodes: 1,
  },
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<'deals' | 'vault'>('deals');

  const mainLinks = [
    {
      label: 'Home',
      href: '/',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      active: pathname === '/',
    },
    {
      label: 'Latest Deals',
      href: '/latest',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      active: pathname === '/latest',
    },
    {
      label: 'Student Deals',
      href: '/student',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
        </svg>
      ),
      active: pathname === '/student',
    },
    {
      label: 'Startup Deals',
      href: '/startups',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      active: pathname === '/startups',
    },
    {
      label: 'No Credit Card',
      href: '/no-credit-card',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      active: pathname === '/no-credit-card',
    },
    {
      label: 'Browse Brands',
      href: '/brands',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      active: pathname.startsWith('/brands'),
    },
  ];

  const categoryLinks = [
    {
      label: 'Freebies',
      href: '/category/freebies',
      count: categoryCounts.freebies,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      active: pathname === '/category/freebies',
    },
    {
      label: 'Discounts',
      href: '/category/discounts',
      count: categoryCounts.discounts,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      ),
      active: pathname === '/category/discounts',
    },
    {
      label: 'Trials',
      href: '/category/trials',
      count: categoryCounts.trials,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      active: pathname === '/category/trials',
    },
    {
      label: 'Credits',
      href: '/category/credits',
      count: categoryCounts.credits,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      active: pathname === '/category/credits',
    },
    {
      label: 'Promo Codes',
      href: '/category/promo-codes',
      count: categoryCounts.promoCodes,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      active: pathname === '/category/promo-codes',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] flex flex-col h-screen sticky top-0 transition-colors select-none z-30">
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-4 sm:px-5 border-b border-slate-100 dark:border-zinc-800/80">
        <ParadoxLogo href="/" size="md" />
        <div className="flex items-center gap-1.5 shrink-0">
          <ThemeToggle />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition lg:hidden cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* MAIN SECTION */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            MAIN
          </div>
          <nav className="space-y-0.5">
            {mainLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-zinc-800/80 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/40'
                }`}
              >
                <span className={item.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* CATEGORIES SECTION */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            CATEGORIES
          </div>
          <nav className="space-y-0.5">
            {categoryLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-zinc-800/80 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={item.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 font-medium">
                  {item.count}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* SWITCH SECTION */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 px-3 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              SWITCH SECTION
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-500 text-white font-mono">
              NEW
            </span>
          </div>

          <div className="bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-zinc-800">
            <Link
              href="/"
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                pathname !== '/category/freebies'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🏷️</span>
              <span>Deals</span>
            </Link>
            <Link
              href="/category/freebies"
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                pathname === '/category/freebies'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>⭐</span>
              <span>Free Vault</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
