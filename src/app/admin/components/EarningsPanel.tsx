'use client';

import React from 'react';

export default function EarningsPanel() {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            💰
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Cuelinks Affiliate Monetization & Direct Payouts
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Automated monetization and merchant campaigns with direct Indian bank payouts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">
              1. Cuelinks Campaign Linking
            </span>
            <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
              When users click &quot;Claim Deal&quot;, your Cuelinks campaign links record conversions and attribute referral payouts to your account.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">
              2. India Bank Transfers (NEFT / RTGS)
            </span>
            <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
              Native monthly bank deposits directly to Indian bank accounts without foreign exchange fee deductions.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">
              3. Custom Redirection Override
            </span>
            <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
              For high-ticket direct programs (like DigitalOcean, Vultr, AWS, Hetzner), you can insert custom referral codes to earn direct CPA bounty payouts.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-3 flex-wrap">
          <a
            href="https://www.cuelinks.com/publishers"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Cuelinks Publisher Dashboard</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
