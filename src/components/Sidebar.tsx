'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import ParadoxLogo from './ParadoxLogo';

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

  const mainLinks = [
    {
      label: 'Home',
      href: '/',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 22V12h6v10" />
        </svg>
      ),
      active: pathname === '/',
    },
    {
      label: 'Latest Deals',
      href: '/latest',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
      active: pathname === '/latest',
    },
    {
      label: 'Student Deals',
      href: '/student',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
        </svg>
      ),
      active: pathname === '/student',
    },
    {
      label: 'Startup Deals',
      href: '/startups',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      active: pathname === '/startups',
    },
    {
      label: 'No Credit Card',
      href: '/no-credit-card',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6.75 4.5h18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0020.25 4.5H3.75A2.25 2.25 0 001.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      active: pathname === '/no-credit-card',
    },
    {
      label: 'Browse Brands',
      href: '/brands',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 6h.008v.008H6V6z" />
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      active: pathname === '/category/promo-codes',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] flex flex-col h-screen sticky top-0 transition-colors select-none z-30">
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-4 sm:px-5 border-b border-slate-100 dark:border-zinc-800/80">
        <ParadoxLogo href="/" size="md" tag="" />
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
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* MAIN SECTION */}
        <div>
          <div className="px-2.5 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 font-mono">
            Main
          </div>
          <nav className="space-y-1">
            {mainLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] transition-all duration-150 ${
                  item.active
                    ? 'bg-slate-100 text-slate-950 font-bold dark:bg-zinc-800 dark:text-white border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 font-medium'
                }`}
              >
                <span className={item.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-200 transition-colors'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* CATEGORIES SECTION */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="px-2.5 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 font-mono">
            Categories
          </div>
          <nav className="space-y-1">
            {categoryLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] transition-all duration-150 ${
                  item.active
                    ? 'bg-slate-100 text-slate-950 font-bold dark:bg-zinc-800 dark:text-white border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70 dark:text-zinc-300 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={item.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-200 transition-colors'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded-md transition-colors shrink-0 ${
                    item.active
                      ? 'bg-slate-200/80 text-slate-900 font-bold dark:bg-zinc-700 dark:text-zinc-100'
                      : 'bg-slate-100 text-slate-700 dark:bg-zinc-850 dark:text-zinc-300 font-semibold'
                  }`}
                >
                  {item.count}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* DIRECTORY VIEW SWITCHER */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="px-2.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
            Directory Mode
          </div>

          <div className="bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80 dark:border-zinc-800">
            <Link
              href="/"
              onClick={onClose}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                pathname !== '/category/freebies'
                  ? 'bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-xs border border-slate-200/60 dark:border-zinc-700/60'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg
                className={`w-3.5 h-3.5 ${
                  pathname !== '/category/freebies' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>All Deals</span>
            </Link>
            <Link
              href="/category/freebies"
              onClick={onClose}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                pathname === '/category/freebies'
                  ? 'bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-xs border border-slate-200/60 dark:border-zinc-700/60'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg
                className={`w-3.5 h-3.5 ${
                  pathname === '/category/freebies' ? 'text-amber-500' : 'text-slate-400'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Free Vault</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
