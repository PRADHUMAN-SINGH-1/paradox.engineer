'use client';

import React from 'react';
import type { CrawlerHub } from '@/lib/admin/types';

interface CrawlerHubSwitcherProps {
  crawlerHub: CrawlerHub;
  onSelectHub: (hub: CrawlerHub) => void;
  referralDealsCount: number;
  pendingReferralCount: number;
  publishedReferralCount: number;
  directDealsCount: number;
  pendingDirectCount: number;
  publishedDirectCount: number;
  isBulkIngesting: boolean;
  onBulkIngestDirect: () => void;
}

export default function CrawlerHubSwitcher({
  crawlerHub,
  onSelectHub,
  referralDealsCount,
  pendingReferralCount,
  publishedReferralCount,
  directDealsCount,
  pendingDirectCount,
  publishedDirectCount,
  isBulkIngesting,
  onBulkIngestDirect,
}: CrawlerHubSwitcherProps) {
  return (
    <div className="space-y-4">
      {/* 1. Dual-Hub Segmented Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hub 1: Custom Referral & Voucher Programs */}
        <div
          onClick={() => onSelectHub('referral_programs')}
          className={`p-5 rounded-2xl border-2 transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            crawlerHub === 'referral_programs'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-500/30'
              : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-300 dark:hover:border-amber-800'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  🔑
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Custom Referral & Voucher Studio</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-white">
                      {referralDealsCount} Programs
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Generate your own referral link or coupon voucher with guidance steps
                  </p>
                </div>
              </div>
              {crawlerHub === 'referral_programs' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider shrink-0">
                  Active Studio
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
              <span>⏳ {pendingReferralCount} Pending Generation</span>
              <span>•</span>
              <span>✅ {publishedReferralCount} Live</span>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <span>Step Guidance</span>
              <span>➔</span>
            </span>
          </div>
        </div>

        {/* Hub 2: Direct 1-Click Auto-Ingest Deals */}
        <div
          onClick={() => onSelectHub('direct_injection')}
          className={`p-5 rounded-2xl border-2 transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            crawlerHub === 'direct_injection'
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/30'
              : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-300 dark:hover:border-blue-800'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  ⚡
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Direct 1-Click Auto-Ingest Deals</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-600 text-white">
                      {directDealsCount} Deals
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Zero referral setup. Free tiers, open OSS perks, and direct public discounts
                  </p>
                </div>
              </div>
              {crawlerHub === 'direct_injection' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider shrink-0">
                  Active Stream
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
              <span>⏳ {pendingDirectCount} Ready for Ingest</span>
              <span>•</span>
              <span>✅ {publishedDirectCount} In Catalog</span>
            </div>
            {pendingDirectCount > 0 ? (
              <button
                type="button"
                disabled={isBulkIngesting}
                onClick={(e) => {
                  e.stopPropagation();
                  onBulkIngestDirect();
                }}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span>⚡</span>
                <span>{isBulkIngesting ? 'Ingesting...' : `Ingest All Direct (${pendingDirectCount})`}</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                All Ingested ✓
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Active Hub Guidance Banner */}
      {crawlerHub === 'referral_programs' ? (
        <div className="bg-amber-500/10 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 text-xs space-y-1">
          <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 text-sm">
            <span>🔑</span>
            <span>Referral & Voucher Generator Studio Active</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            These {referralDealsCount} programs (DigitalOcean, Vultr, Hetzner, AWS Activate, GCP, MongoDB, Supabase, JetBrains, etc.) allow you to generate your own personalized vouchers or referral links. Click <strong>&quot;View Steps & Guidance&quot;</strong> on any card to see instructions, paste your link or code, and publish directly to the matching section.
          </p>
        </div>
      ) : crawlerHub === 'direct_injection' ? (
        <div className="bg-blue-500/10 border border-blue-300 dark:border-blue-800 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2 text-sm">
                <span>⚡</span>
                <span>Direct Ingestion Stream Active ({directDealsCount} Verified Deals)</span>
              </div>
              <p className="text-blue-800 dark:text-blue-300 leading-relaxed mt-0.5">
                These perks (Cloudflare Workers, Docker Pro OSS, Stripe Atlas, Modal, DeepSeek, Neon Postgres, Mistral, Replicate) require zero referral setup. Ingest them directly into your catalog.
              </p>
            </div>
            {pendingDirectCount > 0 && (
              <button
                type="button"
                disabled={isBulkIngesting}
                onClick={onBulkIngestDirect}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>⚡</span>
                <span>{isBulkIngesting ? 'Batch Ingesting...' : `1-Click Ingest ALL ${pendingDirectCount} Direct Deals`}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl p-3 text-xs flex justify-between items-center text-slate-700 dark:text-zinc-300">
          <span>Showing all discovered opportunities ({referralDealsCount} referral programs + {directDealsCount} direct perks).</span>
          <button
            type="button"
            onClick={() => onSelectHub('referral_programs')}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
          >
            Switch to Referral Studio ➔
          </button>
        </div>
      )}
    </div>
  );
}
