'use client';

import React from 'react';
import CrawlerHubSwitcher from './CrawlerHubSwitcher';
import CandidateDealCard from './CandidateDealCard';
import type {
  DiscoveredDealItem,
  CrawlerHub,
  CrawlerFilter,
} from '@/lib/admin/types';

interface CrawlerStudioProps {
  crawlerHub: CrawlerHub;
  onSelectHub: (hub: CrawlerHub) => void;
  crawlerFilter: CrawlerFilter;
  onSelectFilter: (filter: CrawlerFilter) => void;
  crawlerSearch: string;
  onSearchChange: (val: string) => void;
  discoveredDeals: DiscoveredDealItem[];
  crawlerLoading: boolean;
  crawlerActionLoading: string | null;
  isBulkIngesting: boolean;
  showCronGuide: boolean;
  onToggleCronGuide: () => void;
  onRefreshCandidates: () => void;
  onRunCrawler: () => void;
  isRefreshing: boolean;
  onBulkIngestDirect: () => void;
  onOpenGuidance: (deal: DiscoveredDealItem) => void;
  onOpenCustomize: (deal: DiscoveredDealItem) => void;
  onIngestDeal: (deal: DiscoveredDealItem) => void;
  onNavigateToSection: (sectionId: string) => void;
}

export default function CrawlerStudio({
  crawlerHub,
  onSelectHub,
  crawlerFilter,
  onSelectFilter,
  crawlerSearch,
  onSearchChange,
  discoveredDeals,
  crawlerLoading,
  crawlerActionLoading,
  isBulkIngesting,
  showCronGuide,
  onToggleCronGuide,
  onRefreshCandidates,
  onRunCrawler,
  isRefreshing,
  onBulkIngestDirect,
  onOpenGuidance,
  onOpenCustomize,
  onIngestDeal,
  onNavigateToSection,
}: CrawlerStudioProps) {
  // Separate candidate pools
  const referralDeals = discoveredDeals.filter((d) => d.canGenerateOwnCode);
  const directDeals = discoveredDeals.filter((d) => !d.canGenerateOwnCode);

  const pendingReferralCount = referralDeals.filter((d) => !d.isPublished).length;
  const publishedReferralCount = referralDeals.filter((d) => d.isPublished).length;

  const pendingDirectCount = directDeals.filter((d) => !d.isPublished).length;
  const publishedDirectCount = directDeals.filter((d) => d.isPublished).length;

  const hubBaseDeals =
    crawlerHub === 'referral_programs'
      ? referralDeals
      : crawlerHub === 'direct_injection'
      ? directDeals
      : discoveredDeals;

  const filteredDiscoveredDeals = hubBaseDeals.filter((deal) => {
    if (crawlerSearch.trim()) {
      const q = crawlerSearch.toLowerCase();
      const match =
        deal.title.toLowerCase().includes(q) ||
        deal.brandName.toLowerCase().includes(q) ||
        deal.shortDescription.toLowerCase().includes(q) ||
        deal.discountAmount.toLowerCase().includes(q) ||
        (deal.promoCode && deal.promoCode.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (crawlerFilter === 'cloud') {
      return (
        deal.topicSlug.includes('cloud') ||
        deal.topicSlug.includes('hosting') ||
        deal.dealType === 'credit'
      );
    }
    if (crawlerFilter === 'ai') {
      return (
        deal.topicSlug === 'ai' ||
        deal.title.toLowerCase().includes('ai') ||
        deal.title.toLowerCase().includes('tokens')
      );
    }
    if (crawlerFilter === 'student') return deal.isStudentDeal;
    if (crawlerFilter === 'pending') return !deal.isPublished;
    if (crawlerFilter === 'published') return deal.isPublished;

    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Autonomous Pipeline & Custom Code Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Deal Discovery Crawler & Custom Voucher Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Discover verified developer perks, cloud compute vouchers, and programs where you can generate custom redeem codes. Follow step-by-step guidance, copy your referral tokens, and publish instantly.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={onRefreshCandidates}
              disabled={crawlerLoading}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className={crawlerLoading ? 'animate-spin' : ''}>🔄</span>
              <span>{crawlerLoading ? 'Scanning...' : 'Refresh Candidates'}</span>
            </button>

            <button
              type="button"
              onClick={onRunCrawler}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isRefreshing ? '⏳' : '⚡'}</span>
              <span>{isRefreshing ? 'Running Discovery...' : 'Scan & Ingest All Now'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleCronGuide}
              className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚙️</span>
              <span>{showCronGuide ? 'Hide Webhook' : 'Webhook Setup'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dual-Hub Segmented Switcher & Context Guidance */}
      <CrawlerHubSwitcher
        crawlerHub={crawlerHub}
        onSelectHub={onSelectHub}
        referralDealsCount={referralDeals.length}
        pendingReferralCount={pendingReferralCount}
        publishedReferralCount={publishedReferralCount}
        directDealsCount={directDeals.length}
        pendingDirectCount={pendingDirectCount}
        publishedDirectCount={publishedDirectCount}
        isBulkIngesting={isBulkIngesting}
        onBulkIngestDirect={onBulkIngestDirect}
      />

      {/* 3. Controls: Sub-filters & Search */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(
              [
                { id: 'all', label: `All in Hub (${hubBaseDeals.length})` },
                { id: 'cloud', label: '☁️ Cloud & Infra' },
                { id: 'ai', label: '🤖 AI & LLM Grants' },
                { id: 'student', label: '🎓 Student Perks' },
                { id: 'pending', label: `⏳ Pending (${hubBaseDeals.filter((d) => !d.isPublished).length})` },
                { id: 'published', label: `✅ In Catalog (${hubBaseDeals.filter((d) => d.isPublished).length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectFilter(tab.id as typeof crawlerFilter)}
                className={`px-3 py-1.5 rounded-xl transition font-medium whitespace-nowrap cursor-pointer ${
                  crawlerFilter === tab.id
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {crawlerHub !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectHub('all')}
                className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-zinc-400 text-xs font-semibold whitespace-nowrap cursor-pointer"
              >
                View All ({discoveredDeals.length})
              </button>
            )}
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={crawlerSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search discovered offers..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
          </div>
        </div>
      </div>

      {/* 4. Candidate Deals Grid */}
      {crawlerLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 dark:bg-zinc-850 rounded w-2/3" />
                </div>
              </div>
              <div className="h-10 bg-slate-100 dark:bg-zinc-850 rounded" />
            </div>
          ))}
        </div>
      ) : filteredDiscoveredDeals.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8 space-y-3">
          <p className="text-3xl">🔍</p>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
            No discovered deals found
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            No offers match your selected hub, filter, or search query.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectFilter('all');
              onSearchChange('');
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDiscoveredDeals.map((deal) => (
            <CandidateDealCard
              key={deal.slug}
              deal={deal}
              crawlerActionLoading={crawlerActionLoading}
              onOpenGuidance={onOpenGuidance}
              onOpenCustomize={onOpenCustomize}
              onIngestDeal={onIngestDeal}
              onNavigateToSection={onNavigateToSection}
            />
          ))}
        </div>
      )}

      {/* 5. Collapsible Cron Webhook Information */}
      {showCronGuide && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-semibold mb-2">
              <span>⏰</span>
              <span>100% Hands-Free Scheduling</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Set Up Recurring 6-Hour Automated Ingestion
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
              To have new deals ingested and expired deals pruned automatically without opening this dashboard, hook up your background cron endpoint to any free cron scheduler (such as cron-job.org, EasyCron, or GitHub Actions).
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-200">
            POST /api/cron/refresh-deals
          </div>
        </div>
      )}
    </div>
  );
}
