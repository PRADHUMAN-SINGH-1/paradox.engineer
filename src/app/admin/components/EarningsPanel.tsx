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
              Skimlinks Affiliate Monetization & Direct Payouts
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Universal dynamic link rewriting across 48,000+ merchant affiliate programs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">
              1. Universal Link Wrapping
            </span>
            <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
              When users click &quot;Claim Deal&quot;, your Skimlinks publisher tag automatically appends tracking tokens, crediting commissions to your account.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">
              2. India Bank Transfers (Wire / ACH)
            </span>
            <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
              Supports monthly automatic direct bank deposits to Indian bank accounts (SWIFT/IFSC) or PayPal / Payoneer without transaction deductions.
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
            href="https://hub.skimlinks.com/settings/payment"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Skimlinks Payment Settings</span>
            <span>↗</span>
          </a>

          <a
            href="https://hub.skimlinks.com/reports/performance"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Real-Time Commission Reports</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
