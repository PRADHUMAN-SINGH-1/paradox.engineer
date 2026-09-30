'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { getDealTargetSection } from '@/lib/admin/sections';
import type { DiscoveredDealItem } from '@/lib/admin/types';

interface CandidateDealCardProps {
  deal: DiscoveredDealItem;
  crawlerActionLoading: string | null;
  onOpenGuidance: (deal: DiscoveredDealItem) => void;
  onOpenCustomize: (deal: DiscoveredDealItem) => void;
  onIngestDeal: (deal: DiscoveredDealItem) => void;
  onNavigateToSection: (sectionId: string) => void;
}

export default function CandidateDealCard({
  deal,
  crawlerActionLoading,
  onOpenGuidance,
  onOpenCustomize,
  onIngestDeal,
  onNavigateToSection,
}: CandidateDealCardProps) {
  const targetSection = getDealTargetSection(deal);

  return (
    <div
      className={`border rounded-2xl p-5 space-y-4 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
        deal.canGenerateOwnCode
          ? 'border-amber-300/80 dark:border-amber-700/60 bg-gradient-to-b from-amber-500/[0.04] to-white dark:to-zinc-900'
          : 'border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900'
      }`}
    >
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrandLogo name={deal.brandName} website={deal.brandWebsite} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {deal.brandName}
                </span>
                <a
                  href={deal.brandWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-slate-400 hover:text-blue-600"
                >
                  ↗
                </a>
              </div>
              {/* Target Section Badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 mt-0.5">
                <span>📁</span>
                <span>{targetSection.icon}</span>
                <span>{targetSection.label}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {deal.canGenerateOwnCode ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                <span>🔑</span>
                <span>Referral Program</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900 flex items-center gap-1">
                <span>⚡</span>
                <span>Direct Deal</span>
              </span>
            )}

            {deal.isPublished ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ✓ In Catalog
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                ⏳ Ready to Ingest
              </span>
            )}
          </div>
        </div>

        {/* Title & Short Description */}
        <div>
          <h4
            onClick={() => onOpenGuidance(deal)}
            className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer line-clamp-2 transition leading-snug"
          >
            {deal.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2">
            {deal.shortDescription}
          </p>
        </div>

        {/* Value, Commission & Promo Code */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/80 dark:border-blue-900">
            {deal.discountAmount}
          </span>

          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800 text-[11px]">
            <span>💰</span>
            <span>{deal.commissionRate || 'Standard CPA'}</span>
          </span>

          {deal.promoCode && (
            <span className="font-mono text-[11px] bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200">
              Code: {deal.promoCode}
            </span>
          )}
        </div>

        {/* Custom Code Admin Guidance Callout */}
        {deal.canGenerateOwnCode && (
          <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-xl p-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-amber-900 dark:text-amber-200 font-semibold text-[11px]">
              <span className="flex items-center gap-1.5">
                <span>🛠️</span>
                <span>Admin Generation: {deal.adminGuideSteps?.length || 0} Steps Included</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60">
                {deal.codeGenerationType?.replace('_', ' ') || 'Voucher'}
              </span>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
              Generate your custom voucher or referral link directly in the partner console.
            </p>
          </div>
        )}

        {/* Claims & Verification Info */}
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-2">
          <span>{deal.howToClaim?.length || 0} redemption steps</span>
          <span>•</span>
          <span>{deal.keyBenefits?.length || 0} perks</span>
          {deal.isStudentDeal && (
            <>
              <span>•</span>
              <span className="text-blue-600 font-medium">Student Verified</span>
            </>
          )}
        </div>
      </div>

      {/* Card Actions Bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onOpenGuidance(deal)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-800 dark:text-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>📖</span>
          <span>View Steps & Guidance</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {deal.canGenerateOwnCode && deal.codeGenerationPortalUrl && (
            <a
              href={deal.codeGenerationPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1 shadow-xs"
            >
              <span>Open Console</span>
              <span>↗</span>
            </a>
          )}

          {deal.isPublished ? (
            <div className="flex items-center gap-1.5">
              {/* Instant Navigation to Target Dashboard Section */}
              <button
                type="button"
                onClick={() => onNavigateToSection(targetSection.sectionId)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900 transition flex items-center gap-1 cursor-pointer"
                title={`View in ${targetSection.label} dashboard section`}
              >
                <span>{targetSection.icon}</span>
                <span>View in {targetSection.label.split(' ')[0]} Section ➔</span>
              </button>

              <Link
                href={`/resources/${deal.slug}`}
                target="_blank"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1"
              >
                <span>Live</span>
                <span>↗</span>
              </Link>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onOpenCustomize(deal)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                ✏️ Customize
              </button>
              <button
                type="button"
                disabled={crawlerActionLoading === deal.slug}
                onClick={() => onIngestDeal(deal)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span>⚡</span>
                <span>{crawlerActionLoading === deal.slug ? 'Publishing...' : '1-Click Ingest'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
