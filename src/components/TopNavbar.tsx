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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setTopicsOpen(false);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/90 backdrop-blur-md transition-colors">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Trigger + Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Mobile hamburger button + Mobile Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              aria-label="Open sidebar"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <ParadoxLogo href="/" size="sm" showWordmark={false} />
          </div>

          {/* Search Box with Cmd+K */}
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs font-sans">
          {/* Topics Dropdown */}
          <div className="relative" ref={dropdownRef}>
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

          {/* Admin link */}
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            <svg className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Admin</span>
          </Link>

          {/* Theme Toggle (Night mode) - only on mobile when sidebar is off-screen */}
          <div className="lg:hidden">
            <ThemeToggle />
          </div>

          {/* Submit Deal Button */}
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold text-xs px-3.5 py-1.5 rounded-full transition shadow-xs hover:shadow-sm"
          >
            <span className="text-sm leading-none">+</span>
            <span>Submit Deal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
