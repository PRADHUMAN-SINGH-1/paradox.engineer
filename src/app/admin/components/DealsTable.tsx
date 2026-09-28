'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import ExpiryBadge from '@/components/ExpiryBadge';
import { DASHBOARD_SECTIONS, getDealTargetSection } from '@/lib/admin/sections';
import type { DealItem, DealsStatusFilter } from '@/lib/admin/types';

interface DealsTableProps {
  deals: DealItem[];
  selectedSection: string;
  onSelectSection: (sectionId: string) => void;
  dealsFilter: DealsStatusFilter;
  onSelectFilter: (filter: DealsStatusFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  recentlyIngestedSlug: string | null;
  onToggleDeal: (id: string) => void;
  onEditDeal: (deal: DealItem) => void;
  onDeleteDeal: (id: string, title: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function DealsTable({
  deals,
  selectedSection,
  onSelectSection,
  dealsFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  recentlyIngestedSlug,
  onToggleDeal,
  onEditDeal,
  onDeleteDeal,
  isLoading = false,
  onRefresh,
}: DealsTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [adminSearchDropdownOpen, setAdminSearchDropdownOpen] = useState(false);
  const adminSearchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (adminSearchRef.current && !adminSearchRef.current.contains(e.target as Node)) {
        setAdminSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter catalog deals by chosen dashboard hub section
  const sectionFilteredDeals = deals.filter((deal) => {
    if (selectedSection === 'all') return true;
    const target = getDealTargetSection(deal);
    return target.sectionId === selectedSection;
  });

  const matchingSuggestions = searchQuery.trim()
    ? deals
        .filter(
          (d) =>
            d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.promoCode && d.promoCode.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyUrl = (url?: string | null, id?: string) => {
    if (!url || !id) return;
    navigator.clipboard.writeText(url);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. Dashboard Section Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {DASHBOARD_SECTIONS.map((sec) => {
          const count =
            sec.id === 'all'
              ? deals.length
              : deals.filter((d) => getDealTargetSection(d).sectionId === sec.id).length;
          const isSelected = selectedSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`px-3 py-2 rounded-xl transition font-medium whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-blue-600 text-white font-semibold border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Controls Bar: Status Filters, Search & Refresh */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800/80 p-1 rounded-xl text-xs overflow-x-auto">
          {(['all', 'active', 'inactive', 'expired'] as const).map((filter) => {
            const isActive = dealsFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => onSelectFilter(filter)}
                className={`px-3 py-1.5 rounded-lg transition font-medium capitalize cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Search, Count & Instant Refresh */}
        <div className="flex items-center gap-2.5 flex-1 max-w-lg justify-end">
          <div ref={adminSearchRef} className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search deals, brands, codes..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setAdminSearchDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setAdminSearchDropdownOpen(true);
              }}
              className="w-full pl-8 pr-8 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setAdminSearchDropdownOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}

            {/* Instant Admin Suggestions Dropdown */}
            {adminSearchDropdownOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800/80 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/40">
                  <span>⚡ Quick Results ({matchingSuggestions.length})</span>
                  <span>Click to select</span>
                </div>
                {matchingSuggestions.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {matchingSuggestions.map((deal) => (
                      <button
                        key={deal.id}
                        type="button"
                        onClick={() => {
                          onSearchChange(deal.title);
                          setAdminSearchDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center justify-between gap-2.5 px-3 py-2 hover:bg-blue-50/80 dark:hover:bg-zinc-800/80 transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <BrandLogo
                            name={deal.brand.name}
                            logoUrl={deal.brand.logoUrl}
                            website={deal.brand.website}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-[11px] text-slate-900 dark:text-white block truncate">
                              {deal.brand.name}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-zinc-300 block truncate group-hover:text-blue-600">
                              {deal.title}
                            </span>
                          </div>
                        </div>
                        {deal.promoCode && (
                          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 shrink-0">
                            {deal.promoCode}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500">
                    No deals matching &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh catalog list from database"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <span className={`text-sm ${isLoading ? 'animate-spin' : ''}`}>🔄</span>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
            {sectionFilteredDeals.length} {sectionFilteredDeals.length === 1 ? 'deal' : 'deals'}
          </span>
        </div>
      </div>

      {/* 3. Modern Deals Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          /* Sleek Skeleton Loading State */
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-zinc-700 rounded-xl" />
                  <div className="space-y-2">
                    <div className="w-48 h-3.5 bg-slate-200 dark:bg-zinc-700 rounded" />
                    <div className="w-24 h-2.5 bg-slate-200 dark:bg-zinc-700 rounded" />
                  </div>
                </div>
                <div className="w-24 h-4 bg-slate-200 dark:bg-zinc-700 rounded" />
                <div className="w-16 h-6 bg-slate-200 dark:bg-zinc-700 rounded-full" />
              </div>
            ))}
          </div>
        ) : sectionFilteredDeals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/50 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Perk & Brand</th>
                  <th className="py-3 px-4">Offer & Voucher</th>
                  <th className="py-3 px-4 text-center">Engagement</th>
                  <th className="py-3 px-4">Status & Validity</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {sectionFilteredDeals.map((deal) => {
                  const targetSection = getDealTargetSection(deal);
                  const isRecentlyIngested = recentlyIngestedSlug === deal.slug;

                  return (
                    <tr
                      key={deal.id}
                      className={`transition-colors ${
                        isRecentlyIngested
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500/50'
                          : 'hover:bg-slate-50/60 dark:hover:bg-zinc-800/40'
                      }`}
                    >
                      {/* Column 1: Perk & Brand */}
                      <td className="py-3.5 px-5 max-w-sm">
                        <div className="flex items-start gap-3">
                          <BrandLogo
                            name={deal.brand.name}
                            logoUrl={deal.brand.logoUrl}
                            website={deal.brand.website}
                            size="md"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 dark:text-white text-xs">
                                {deal.brand.name}
                              </span>
                              {deal.brand.website && (
                                <a
                                  href={deal.brand.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-slate-400 hover:text-blue-600 transition"
                                  title={`Visit ${deal.brand.name} website`}
                                >
                                  ↗
                                </a>
                              )}
                              {isRecentlyIngested && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500 text-white animate-pulse">
                                  JUST MOVED HERE
                                </span>
                              )}
                            </div>

                            <Link
                              href={`/resources/${deal.slug}`}
                              target="_blank"
                              className="font-medium text-slate-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 block transition"
                              title={deal.title}
                            >
                              {deal.title}
                            </Link>

                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              {/* Section Badge */}
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                                <span>{targetSection.icon}</span>
                                <span>{targetSection.label}</span>
                              </span>
                              {/* Deal Type Badge */}
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                                {deal.dealType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Offer & Voucher */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {deal.discountAmount || 'Verified Perk'}
                          </div>

                          {deal.promoCode ? (
                            <button
                              type="button"
                              onClick={() => handleCopyCode(deal.promoCode!)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition cursor-pointer"
                              title="Click to copy promo code"
                            >
                              <span>🏷️ {deal.promoCode}</span>
                              <span className="text-[9px] text-amber-600 dark:text-amber-400">
                                {copiedCode === deal.promoCode ? '✓' : '⧉'}
                              </span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                              Instant activation link
                            </span>
                          )}

                          {deal.commissionRate && (
                            <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                              💰 {deal.commissionRate}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Column 3: Traffic & Engagement */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col gap-1 items-center bg-slate-50 dark:bg-zinc-800/50 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-zinc-800">
                          <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                            🖱️ <strong className="text-slate-800 dark:text-zinc-200">{deal.clickCount || 0}</strong> claims
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                            👁️ {deal.viewCount || 0} views
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Status & Validity */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onToggleDeal(deal.id)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                deal.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'
                              }`}
                              title={deal.isActive ? 'Deactivate deal' : 'Activate deal'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  deal.isActive ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[11px] font-semibold ${
                                deal.isActive
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-400 dark:text-zinc-500'
                              }`}
                            >
                              {deal.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <div>
                            <ExpiryBadge
                              expiryDate={deal.expiryDate}
                              isLimitedTime={deal.isLimitedTime}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Column 5: Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditDeal(deal)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition cursor-pointer"
                            title="Edit deal details"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyUrl(deal.claimUrl, deal.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                            title="Copy redemption URL"
                          >
                            {copiedUrl === deal.id ? '✓' : '🔗'}
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteDeal(deal.id, deal.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                            title="Delete perk from catalog"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Modern Empty State */
          <div className="py-14 px-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-zinc-800 flex items-center justify-center text-xl text-blue-600">
              📂
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                No deals found in this section
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                {searchQuery
                  ? `No deals matching "${searchQuery}". Try clearing your search query.`
                  : 'Try selecting "All Deals" or explore candidate deals in the Crawler Studio.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition cursor-pointer"
                >
                  Clear Search
                </button>
              )}
              {selectedSection !== 'all' && (
                <button
                  type="button"
                  onClick={() => onSelectSection('all')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                >
                  View All Deals
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
