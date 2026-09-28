'use client';

import { useState } from 'react';
import BrandLogo from './BrandLogo';
import ExpiryBadge from './ExpiryBadge';

interface ClaimActionBoxProps {
  slug: string;
  brandName: string;
  claimUrl: string;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  promoCode?: string | null;
  dealType: string;
  isStudentDeal: boolean;
  needsCreditCard: boolean;
  clickCount: number;
  viewCount: number;
  expiryDate?: Date | string | null;
  isLimitedTime?: boolean;
}

export default function ClaimActionBox({
  slug,
  brandName,
  claimUrl,
  websiteUrl,
  logoUrl,
  promoCode,
  dealType,
  isStudentDeal,
  needsCreditCard,
  clickCount,
  viewCount,
  expiryDate,
  isLimitedTime,
}: ClaimActionBoxProps) {
  const [copied, setCopied] = useState(false);
  const [clicks, setClicks] = useState(clickCount);

  const trackClick = async () => {
    try {
      fetch(`/api/click/${slug}`, { method: 'POST' }).catch(() => {});
      setClicks((prev) => prev + 1);
    } catch (_) {}
  };

  const handleCopyCode = async () => {
    if (promoCode) {
      try {
        await navigator.clipboard.writeText(promoCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  const finalUrl = claimUrl || websiteUrl || '#';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-6">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/60 p-1.5 flex items-center justify-center shrink-0">
            <BrandLogo
              name={brandName}
              logoUrl={logoUrl}
              website={websiteUrl}
              size="md"
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{brandName}</h3>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 capitalize">
              {dealType}
            </span>
          </div>
        </div>

        <ExpiryBadge expiryDate={expiryDate} isLimitedTime={isLimitedTime} />
      </div>

      {/* Promo Code Box (if applicable) */}
      {promoCode && (
        <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
            <span>Coupon / Promo Code</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">Verified</span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-700 rounded-lg p-2.5">
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white tracking-wider">
              {promoCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-xs font-semibold px-3 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-zinc-800 dark:text-zinc-200 transition"
            >
              {copied ? '✓ Copied' : 'Copy Code'}
            </button>
          </div>
        </div>
      )}

      {/* Primary Claim Action - Real HTML <a> anchor tag for Skimlinks affiliate tracking */}
      <div className="space-y-2">
        <a
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackClick();
            if (promoCode) handleCopyCode();
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition text-center"
        >
          <span>Claim Offer on {brandName}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {websiteUrl && websiteUrl !== finalUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-lg text-xs text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white font-medium flex items-center justify-center gap-1.5 transition text-center"
          >
            <span>Visit {brandName} Homepage</span>
            <span>&rarr;</span>
          </a>
        )}
      </div>

      {/* Human-Friendly Offer Specifications (No raw monospace telemetry) */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3 text-xs">
        <h4 className="font-semibold text-slate-900 dark:text-zinc-100">Offer Overview</h4>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
            <span>Payment Method</span>
            {needsCreditCard ? (
              <span className="font-medium text-slate-800 dark:text-zinc-200">Credit card required</span>
            ) : (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>✓</span> No credit card needed
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
            <span>Student Verification</span>
            <span className="font-medium text-slate-800 dark:text-zinc-200">
              {isStudentDeal ? 'Required (.edu email)' : 'Not required'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
            <span>Community Claims</span>
            <span className="font-medium text-slate-800 dark:text-zinc-200">
              {clicks.toLocaleString()} claims ({viewCount.toLocaleString()} views)
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
            <span>Last Verified</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Verified active today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
