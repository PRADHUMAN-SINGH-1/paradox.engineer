'use client';

import React from 'react';

interface AdminLoginGateProps {
  adminKeyInput: string;
  setAdminKeyInput: (val: string) => void;
  showKey: boolean;
  setShowKey: (val: boolean) => void;
  authError: string | null;
  authLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminLoginGate({
  adminKeyInput,
  setAdminKeyInput,
  showKey,
  setShowKey,
  authError,
  authLoading,
  onSubmit,
}: AdminLoginGateProps) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-xl shadow-blue-500/25">
            P
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <span>🔒</span>
            <span>Paradox Engineer /admin</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin Control Gateway
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Enter your master key to access deal ingestion, referral studios, and catalog management.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              Admin Master Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                required
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                placeholder="Enter master key..."
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 text-sm cursor-pointer"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? '👁️' : '🙈'}
              </button>
            </div>
            {authError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium flex items-center gap-1">
                <span>⚠️</span>
                <span>{authError}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{authLoading ? 'Verifying...' : 'Unlock Admin Dashboard ➔'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 text-center text-[11px] text-slate-400 dark:text-zinc-500">
          <span>🔒 End-to-end token validation with automated Supabase fallback</span>
        </div>
      </div>
    </div>
  );
}
