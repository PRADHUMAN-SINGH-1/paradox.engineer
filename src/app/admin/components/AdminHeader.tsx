'use client';

import React from 'react';

interface AdminHeaderProps {
  isRefreshing: boolean;
  onRunRefresher: () => void;
  onOpenAddModal: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  isRefreshing,
  onRunRefresher,
  onOpenAddModal,
  onLogout,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 dark:border-zinc-800 gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Control Center
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Paradox Deal Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Manage live catalog offers, exact redemption URLs, automated crawler, and Cuelinks monetization.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onRunRefresher}
          disabled={isRefreshing}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span>🔄</span>
          <span>{isRefreshing ? 'Running Sync...' : 'Sync Crawler'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <span className="text-sm leading-none">+</span>
          <span>Add New Deal</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1 cursor-pointer"
          title="Lock admin session and clear credentials"
        >
          <span>🔒</span>
          <span>Lock</span>
        </button>
      </div>
    </div>
  );
}
