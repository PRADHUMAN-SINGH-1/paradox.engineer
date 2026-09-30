'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUICK_FILTERS = [
  { label: 'Claude Code', query: 'Claude' },
  { label: 'DeepSeek API', query: 'DeepSeek' },
  { label: 'ChatGPT', query: 'ChatGPT' },
  { label: 'Cloud Credits', query: 'Credits' },
  { label: 'Student (.edu)', query: 'Student' },
  { label: 'Postgres', query: 'Postgres' },
  { label: 'No CC', query: 'No CC' },
];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleTagClick = (filter: string) => {
    setQuery(filter);
    router.push(`/?q=${encodeURIComponent(filter)}`);
  };

  return (
    <div className="relative border-b border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-14 sm:py-20 bg-grid-pattern mb-8 transition-colors">
      {/* Radial fade for the grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(248,250,252,0.9)_75%)] dark:bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#09090b_75%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 text-[11px] font-mono mb-6 shadow-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-emerald-400 shadow-[0_0_8px_rgba(79,70,229,0.6)] dark:shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span>PARADOX_INDEX // 36 VERIFIED ACTIVE GRANTS</span>
        </div>

        {/* Primary Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-sans leading-tight">
          Infrastructure Credits &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-500">
            Developer Perks
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
          Aggregated index of verified LLM API credits, cloud compute grants, developer software tiers, and student privileges. Autonomously discovered and indexed.
        </p>

        {/* Command Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-5">
          <div className="relative flex items-center group">
            <div className="absolute left-4 text-indigo-600 dark:text-indigo-400 font-mono text-sm pointer-events-none group-focus-within:text-indigo-700 dark:group-focus-within:text-indigo-300 transition-colors font-bold">
              $
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="filter index by keyword (e.g. claude, supabase, student, credits)..." 
              className="w-full pl-9 pr-28 py-3.5 rounded-xl border border-slate-300 bg-slate-50/70 hover:bg-white focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-750 dark:focus:border-indigo-500/60 text-slate-900 dark:text-zinc-100 text-sm font-mono focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-600/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 shadow-xs"
            />
            <button 
              type="submit" 
              className="absolute right-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-semibold px-4 py-1.5 rounded-lg text-xs transition cursor-pointer font-sans shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-mono">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider mr-1">QUICK_FILTER:</span>
          {QUICK_FILTERS.map((tag) => (
            <button
              key={tag.label}
              onClick={() => handleTagClick(tag.query)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 border border-slate-200 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 text-[11px] font-medium transition cursor-pointer shadow-2xs"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
