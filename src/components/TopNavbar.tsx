'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import ParadoxLogo from './ParadoxLogo';

interface TopNavbarProps {
  topics?: Array<{
    name: string;
    slug: string;
    icon?: string | null;
    _count?: { deals: number };
  }>;
  onOpenMobileMenu?: () => void;
}

export default function TopNavbar({ topics = [], onOpenMobileMenu }: TopNavbarProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        mobileSearchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setTopicsOpen(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTopicsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?q=${encodeURIComponent(search.trim())}`);
      setMobileSearchOpen(false);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/90 backdrop-blur-md transition-colors">
      <div className="w-full px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Trigger + Full Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open sidebar"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Full Logo + Wordmark visible on mobile */}
          <div className="lg:hidden flex items-center">
            <ParadoxLogo href="/" size="sm" showWordmark={true} />
          </div>
        </div>

        {/* Center: Desktop Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-auto">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 dark:text-zinc-500 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search deals, brands, or perks..."
                className="w-full pl-9 pr-14 py-1.5 text-xs sm:text-sm bg-slate-100/80 dark:bg-zinc-900/90 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 rounded-full border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition"
              />
              <span className="absolute right-2.5 hidden sm:flex items-center gap-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-zinc-500 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded px-1.5 py-0.5 pointer-events-none">
                ⌘K
              </span>
            </div>
          </form>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-xs font-sans">
          {/* Mobile Search Toggle Icon */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Search"
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Topics Dropdown (Tablet & Desktop) */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setTopicsOpen(!topicsOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition"
            >
              <span>Topics</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${topicsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {topicsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0c0d0e] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    All Categories
                  </span>
                  <Link
                    href="/topics"
                    onClick={() => setTopicsOpen(false)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    View All &rarr;
                  </Link>
                </div>
                <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
                  {topics.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/topics/${topic.slug}`}
                      onClick={() => setTopicsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-zinc-300 hover:bg-blue-50/70 hover:text-blue-700 dark:hover:bg-zinc-800/70 dark:hover:text-white transition"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-sm shrink-0">{topic.icon || '🏷️'}</span>
                        <span className="font-medium truncate">{topic.name}</span>
                      </div>
                      {typeof topic._count?.deals === 'number' && (
                        <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                          {topic._count.deals}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Night mode) - visible on mobile & desktop */}
          <ThemeToggle />

          {/* Submit Deal Button */}
          <Link
            href="/submit"
            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold text-xs px-2.5 sm:px-3.5 py-1.5 rounded-full transition shadow-xs hover:shadow-sm shrink-0"
          >
            <span className="text-sm leading-none">+</span>
            <span className="hidden xs:inline">Submit Deal</span>
            <span className="xs:hidden">Submit</span>
          </Link>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-3 py-2 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200/80 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 dark:text-zinc-500 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search deals, brands, or perks..."
                className="w-full pl-9 pr-9 py-2 text-xs bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 rounded-lg border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
