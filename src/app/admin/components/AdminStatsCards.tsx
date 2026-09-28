'use client';

import React from 'react';
import type { AdminStats } from '@/lib/admin/types';

interface AdminStatsCardsProps {
  stats: AdminStats;
  pendingSubmissionsCount: number;
}

export default function AdminStatsCards({
  stats,
  pendingSubmissionsCount,
}: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
        <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">
          Active Catalog Perks
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {stats.totalDeals}
        </div>
        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium flex items-center gap-1">
          <span>●</span> All verified & indexed
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
        <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">
          Covered Brands
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {stats.totalBrands}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1.5 truncate">
          Anthropic, OpenAI, Civo...
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
        <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">
          Curated Topics
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {stats.totalTopics}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1.5">
          12 categories populated
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
        <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">
          Pending Submissions
        </div>
        <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
          {pendingSubmissionsCount}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1.5">
          Community queue
        </div>
      </div>
    </div>
  );
}
