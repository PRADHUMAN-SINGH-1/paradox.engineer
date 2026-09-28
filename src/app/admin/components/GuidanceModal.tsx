'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { getDealTargetSection } from '@/lib/admin/sections';
import type { DiscoveredDealItem } from '@/lib/admin/types';

interface GuidanceModalProps {
  deal: DiscoveredDealItem | null;
  onClose: () => void;
  onIngest: (deal: DiscoveredDealItem, promoCode: string, claimUrl: string) => void;
  loading: boolean;
}

export default function GuidanceModal({
  deal,
  onClose,
  onIngest,
  loading,
}: GuidanceModalProps) {
  const [activeTab, setActiveTab] = useState<'admin_guide' | 'user_claim'>(
    deal?.canGenerateOwnCode ? 'admin_guide' : 'user_claim'
  );
  const [customPromoCode, setCustomPromoCode] = useState(deal?.promoCode || '');
  const [customClaimUrl, setCustomClaimUrl] = useState(deal?.claimUrl || '');

  if (!deal) return null;

  const targetSection = getDealTargetSection(deal);

  const handlePublish = () => {
    onIngest(deal, customPromoCode, customClaimUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-start gap-3">
            <BrandLogo name={deal.brandName} website={deal.brandWebsite} size="md" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {deal.brandName}
                </span>
                {deal.canGenerateOwnCode && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    🔑 Admin Generates Code
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase">
                  {deal.dealType}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 flex items-center gap-1">
                  <span>📁 Destination:</span>
                  <span>{targetSection.icon}</span>
                  <span>{targetSection.label}</span>
                </span>
                {deal.isPublished && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                    ✓ Currently in Catalog
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                {deal.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                <span className="font-extrabold text-blue-600 dark:text-blue-400">
                  {deal.discountAmount}
                </span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  💰 {deal.commissionRate || 'Standard CPA'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
          {deal.canGenerateOwnCode && (
            <button
              type="button"
              onClick={() => setActiveTab('admin_guide')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin_guide'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>🛠️ How You Generate the Code</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {deal.adminGuideSteps?.length || 0}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('user_claim')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'user_claim'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>👤 How Developers Claim Deal</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {deal.howToClaim?.length || 0}
            </span>
          </button>
        </div>

        {/* Tab 1: Admin Guide */}
        {activeTab === 'admin_guide' && deal.canGenerateOwnCode && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Partner Console & Voucher Generator
                </h4>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 mt-0.5">
                  Open the partner portal, grab your custom promo voucher or referral slug, and paste it into the deployment box below.
                </p>
              </div>
              {deal.codeGenerationPortalUrl && (
                <a
                  href={deal.codeGenerationPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Console</span>
                  <span>↗</span>
                </a>
              )}
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[11px]">
                Step-by-Step Instructions to Generate Your Code:
              </h4>
              <div className="space-y-2">
                {deal.adminGuideSteps?.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800/80"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-800 dark:text-zinc-200 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs space-y-1">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span>💰</span>
                <span>Estimated Partner Commission:</span>
              </div>
              <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                {deal.commissionRate || 'Standard CPA'} — When users register using your code or claim URL, you receive partner credit or direct monthly bank transfer.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: User Claim Flow */}
        {activeTab === 'user_claim' && (
          <div className="space-y-5">
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[11px]">
                How Developers Claim & Redeem This Deal (Displayed on Paradox Deals):
              </h4>
              <div className="space-y-2">
                {deal.howToClaim?.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800/80"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-800 dark:text-zinc-200 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Perks & Eligibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>✨</span>
                  <span>Key Benefits</span>
                </div>
                <ul className="space-y-1 text-slate-600 dark:text-zinc-400 text-[11px]">
                  {deal.keyBenefits?.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 shrink-0">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>📋</span>
                  <span>Eligibility Requirements</span>
                </div>
                <ul className="space-y-1 text-slate-600 dark:text-zinc-400 text-[11px]">
                  {deal.eligibility?.map((e, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 shrink-0">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Publication Box */}
        <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Publish Deal to Live Catalog
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Insert your generated referral code or custom URL before publishing. When published, this deal will automatically move to your <strong>{targetSection.icon} {targetSection.label}</strong> section.
              </p>
            </div>
            {deal.isPublished && (
              <Link
                href={`/resources/${deal.slug}`}
                target="_blank"
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                View Live Page ↗
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                Redemption / Promo Code (Optional)
              </label>
              <input
                type="text"
                value={customPromoCode}
                onChange={(e) => setCustomPromoCode(e.target.value)}
                placeholder="e.g. DO-DEV200 or PARADOX"
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                Exact Claim / Referral URL *
              </label>
              <input
                type="url"
                value={customClaimUrl}
                onChange={(e) => setCustomClaimUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handlePublish}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <span>{loading ? '⏳' : '✓'}</span>
              <span>
                {loading
                  ? 'Publishing...'
                  : deal.isPublished
                  ? 'Update / Re-Publish Deal'
                  : 'Publish Deal to Live Catalog'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
