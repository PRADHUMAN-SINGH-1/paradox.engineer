'use client';
import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#09090b]/85 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo & Brand */}
          <div className="flex items-center gap-7">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 dark:bg-white group-hover:scale-110 transition-transform"></span>
              <span className="font-mono font-bold text-sm tracking-widest text-slate-900 dark:text-zinc-100 uppercase">
                PARADOX
              </span>
              <span className="font-mono text-[10px] text-blue-700 bg-blue-50 border border-blue-200 dark:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 px-1 py-0.2 rounded font-semibold">
                engineer
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-5 text-xs font-medium text-slate-600 dark:text-zinc-400 font-mono">
              <Link href="/latest" className="hover:text-blue-600 dark:hover:text-zinc-100 transition">/latest</Link>
              <Link href="/student" className="hover:text-blue-600 dark:hover:text-zinc-100 transition">/students</Link>
              <Link href="/startups" className="hover:text-blue-600 dark:hover:text-zinc-100 transition">/startups</Link>
              <Link href="/no-credit-card" className="hover:text-blue-600 dark:hover:text-zinc-100 transition">/no-cc</Link>
              <Link href="/brands" className="hover:text-blue-600 dark:hover:text-zinc-100 transition">/brands</Link>
              <Link href="/topics" className="hover:text-blue-600 dark:hover:text-zinc-100 transition">/categories</Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3 text-xs font-mono">
            {/* Theme Toggle (Night mode / White-Blue mode) */}
            <ThemeToggle />

            <Link
              href="/admin"
              className="text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
            >
              [console]
            </Link>
            <Link
              href="/submit"
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold px-3.5 py-1.5 rounded-lg transition text-xs font-sans shadow-xs"
            >
              + Submit Perk
            </Link>
          </div>

          {/* Mobile Toggle & Theme Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-zinc-800/80 space-y-2.5 text-xs font-mono">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded">/home</Link>
            <Link href="/latest" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded">/latest</Link>
            <Link href="/student" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded">/students</Link>
            <Link href="/startups" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded">/startups</Link>
            <Link href="/no-credit-card" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded">/no-cc</Link>
            <Link href="/brands" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded">/brands</Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 rounded">[console]</Link>
            <Link href="/submit" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-white bg-blue-600 dark:bg-zinc-800 rounded font-sans text-center mt-2">+ Submit Perk</Link>
          </div>
        )}
      </div>
    </header>
  );
}
