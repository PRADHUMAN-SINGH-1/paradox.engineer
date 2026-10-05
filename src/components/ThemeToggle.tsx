'use client';

import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ showLabel = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-8 h-8 rounded-lg border border-slate-200/80 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-800/50 ${className}`} />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Night Mode"
      className={`w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800 transition flex items-center justify-center cursor-pointer ${className}`}
      title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to White & Blue Mode'}
    >
      {theme === 'light' ? (
        <>
          <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          {showLabel && <span className="ml-1.5 text-[11px] font-semibold text-slate-700">Night</span>}
        </>
      ) : (
        <>
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {showLabel && <span className="ml-1.5 text-[11px] font-semibold text-zinc-300">Light</span>}
        </>
      )}
    </button>
  );
}
