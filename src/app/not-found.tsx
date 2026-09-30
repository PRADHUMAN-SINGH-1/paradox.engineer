import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Paradox',
  description: 'The perk or page you are looking for does not exist or has expired.',
};

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center font-sans space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/90 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 font-mono font-extrabold text-2xl">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Page or Perk Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto">
          The requested page or deal might have expired, been updated, or moved to a different category.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 text-xs font-bold transition shadow-xs"
        >
          Return to All Deals
        </Link>
        <Link
          href="/latest"
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 text-xs font-medium transition"
        >
          Browse Latest Arrivals
        </Link>
        <Link
          href="/brands"
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 text-xs font-medium transition"
        >
          View Brands Directory
        </Link>
      </div>
    </div>
  );
}
