'use client';

import React from 'react';
import type { SubmissionItem, DiscoveredDealItem } from '@/lib/admin/types';

interface PendingSubmissionsProps {
  submissions: SubmissionItem[];
  onApprove: (submissionId: string) => void;
  candidateDeals?: DiscoveredDealItem[];
  onIngestCandidate?: (deal: DiscoveredDealItem) => void;
  onBulkIngestCandidates?: () => void;
  isBulkIngesting?: boolean;
  crawlerActionLoading?: string | null;
}

export default function PendingSubmissions({
  submissions,
  onApprove,
  candidateDeals = [],
  onIngestCandidate,
  onBulkIngestCandidates,
  isBulkIngesting = false,
  crawlerActionLoading = null,
}: PendingSubmissionsProps) {
  const pendingCandidates = candidateDeals.filter((d) => !d.isPublished);
  const pendingDirectCandidates = pendingCandidates.filter((d) => !d.canGenerateOwnCode);

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Candidate Deals Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🤖 Scraped Deals Awaiting Approval & Ingest</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {pendingCandidates.length} Pending
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Verified developer deals and discounts crawled from partners ready to be approved into your live catalog.
            </p>
          </div>

          {pendingDirectCandidates.length > 0 && onBulkIngestCandidates && (
            <button
              type="button"
              disabled={isBulkIngesting}
              onClick={onBulkIngestCandidates}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <span>⚡</span>
              <span>
                {isBulkIngesting
                  ? 'Publishing All...'
                  : `1-Click Approve All Direct (${pendingDirectCandidates.length})`}
              </span>
            </button>
          )}
        </div>

        {pendingCandidates.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
            <p className="text-2xl mb-1">✅</p>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
              All crawled deals are approved and published!
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Check the &quot;All Deals&quot; tab to view or edit existing published perks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingCandidates.map((deal) => {
              const isLoading = crawlerActionLoading === deal.slug;
              return (
                <div
                  key={deal.slug}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:border-blue-400 transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200">
                        {deal.brandName}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold">
                        {deal.discountAmount}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {deal.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {deal.shortDescription}
                    </p>

                    {deal.promoCode && (
                      <div className="text-[11px] font-mono bg-slate-50 dark:bg-zinc-800 px-2 py-1 rounded text-slate-700 dark:text-zinc-300 inline-block">
                        Code: <span className="font-bold text-blue-600 dark:text-blue-400">{deal.promoCode}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {deal.canGenerateOwnCode ? '🔑 Referral Program' : '⚡ Direct Deal'}
                    </span>

                    {onIngestCandidate && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => onIngestCandidate(deal)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {isLoading ? (
                          <span>Publishing...</span>
                        ) : (
                          <>
                            <span>✓</span>
                            <span>Approve & Publish</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Community Submitted Deals Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>👥 Community Submitted Deals</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              {submissions.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Submissions received from the public website submission form.
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 p-6">
            <p className="text-xl mb-1">📥</p>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              No user submissions in queue
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
              When users submit deals through the &quot;Submit a Deal&quot; page, they will show up here for approval.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {sub.brandName}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {sub.dealTitle}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-400">{sub.description}</p>

                <div className="text-xs">
                  <span className="text-slate-400">Target URL: </span>
                  <a
                    href={sub.dealUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-mono text-[11px] truncate inline-block max-w-xs"
                  >
                    {sub.dealUrl} ↗
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove(sub.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                  >
                    ✓ Approve & Publish Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
