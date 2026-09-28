'use client';

import React from 'react';
import type { AdminActiveTab } from '@/lib/admin/types';

interface AdminTabsNavProps {
  activeTab: AdminActiveTab;
  onSelectTab: (tab: AdminActiveTab) => void;
  totalDealsCount: number;
  crawlerTotalCount: number;
  customCodeCount: number;
  submissionsCount: number;
}

export default function AdminTabsNav({
  activeTab,
  onSelectTab,
  totalDealsCount,
  crawlerTotalCount,
  customCodeCount,
  submissionsCount,
}: AdminTabsNavProps) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2 overflow-x-auto">
      <button
        type="button"
        onClick={() => onSelectTab('deals')}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
          activeTab === 'deals'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
      >
        All Deals ({totalDealsCount})
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('crawler')}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
          activeTab === 'crawler'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
      >
        <span>🤖 Deal Crawler & Voucher Studio</span>
        {customCodeCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-mono flex items-center gap-0.5">
            <span>🔑</span>
            <span>{customCodeCount}</span>
          </span>
        )}
        {crawlerTotalCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-mono">
            {crawlerTotalCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('submissions')}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
          activeTab === 'submissions'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
      >
        <span>Pending Submissions</span>
        {submissionsCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
            {submissionsCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('earnings')}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
          activeTab === 'earnings'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
      >
        Skimlinks Earnings & India Payouts
      </button>
    </div>
  );
}
