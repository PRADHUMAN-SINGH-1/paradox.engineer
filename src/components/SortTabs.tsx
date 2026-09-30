'use client';

import Link from 'next/link';

interface SortTabsProps {
  currentSort: string;
  baseUrl?: string;
}

const TABS = [
  { id: 'latest', label: 'Latest' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'claimed', label: 'Most Claimed' },
  { id: 'last_updated', label: 'Recently Updated' },
];

export default function SortTabs({ currentSort, baseUrl = '' }: SortTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/80 dark:border-zinc-800 text-xs transition-colors">
      {TABS.map((tab) => {
        const [pathPart, queryPart] = baseUrl.split('?');
        const searchParams = new URLSearchParams(queryPart || '');
        searchParams.set('sort', tab.id);
        searchParams.delete('page');
        const queryString = searchParams.toString();
        const href = `${pathPart || '/'}?${queryString}`;
        const isActive = currentSort === tab.id;

        return (
          <Link
            key={tab.id}
            href={href}
            scroll={false}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap ${
              isActive
                ? 'bg-white text-slate-900 font-semibold dark:bg-zinc-800 dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700'
                : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
