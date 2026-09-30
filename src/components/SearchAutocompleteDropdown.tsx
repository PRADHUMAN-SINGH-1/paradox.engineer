'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import TopicIcon from './TopicIcon';

export interface SearchResultDeal {
  id: string;
  title: string;
  slug: string;
  dealType: string;
  discountAmount?: string | null;
  promoCode?: string | null;
  brand: {
    name: string;
    slug?: string;
    logoUrl?: string | null;
    website?: string | null;
  };
  topic?: {
    name: string;
    slug: string;
  } | null;
}

export interface SearchResultBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  website?: string | null;
  _count?: { deals: number };
}

export interface SearchResultTopic {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  _count?: { deals: number };
}

interface SearchAutocompleteDropdownProps {
  isOpen: boolean;
  query: string;
  isLoading: boolean;
  deals: SearchResultDeal[];
  brands: SearchResultBrand[];
  topics: SearchResultTopic[];
  onSelectDeal?: (deal: SearchResultDeal) => void;
  onSelectBrand?: (brand: SearchResultBrand) => void;
  onSelectTopic?: (topic: SearchResultTopic) => void;
  onViewAll?: () => void;
  className?: string;
}

export default function SearchAutocompleteDropdown({
  isOpen,
  query,
  isLoading,
  deals,
  brands,
  topics,
  onSelectDeal,
  onSelectBrand,
  onSelectTopic,
  onViewAll,
  className = '',
}: SearchAutocompleteDropdownProps) {
  if (!isOpen || !query.trim()) return null;

  const hasResults = deals.length > 0 || brands.length > 0 || topics.length > 0;

  return (
    <div
      className={`absolute left-0 right-0 top-full mt-2 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden font-sans text-left divide-y divide-slate-100 dark:divide-zinc-800/80 animate-in fade-in zoom-in-95 duration-150 ${className}`}
    >
      {isLoading ? (
        <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <svg className="animate-spin w-4 h-4 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Searching deals, brands, and categories...</span>
        </div>
      ) : hasResults ? (
        <div className="max-h-[75vh] overflow-y-auto scrollbar-thin divide-y divide-slate-100 dark:divide-zinc-800/80">
          {/* Section 1: Deals & Discounts */}
          {deals.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Deals & Discounts</span>
                <span className="font-mono">{deals.length}</span>
              </div>
              <div className="space-y-0.5">
                {deals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/resources/${deal.slug}`}
                    onClick={() => onSelectDeal?.(deal)}
                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BrandLogo
                        name={deal.brand.name}
                        logoUrl={deal.brand.logoUrl}
                        website={deal.brand.website}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                            {deal.brand.name}
                          </span>
                          {deal.promoCode && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              {deal.promoCode}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {deal.title}
                        </p>
                      </div>
                    </div>
                    {deal.discountAmount && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 whitespace-nowrap shrink-0">
                        {deal.discountAmount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Brands */}
          {brands.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Brands</span>
                <span className="font-mono">{brands.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.slug}`}
                    onClick={() => onSelectBrand?.(brand)}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BrandLogo
                        name={brand.name}
                        logoUrl={brand.logoUrl}
                        website={brand.website}
                        size="sm"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                        {brand.name}
                      </span>
                    </div>
                    {brand._count && (
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 shrink-0">
                        {brand._count.deals} {brand._count.deals === 1 ? 'deal' : 'deals'}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Categories & Topics */}
          {topics.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                <span>Categories</span>
                <span className="font-mono">{topics.length}</span>
              </div>
              <div className="flex flex-wrap gap-1 px-2 pb-1">
                {topics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/topics/${topic.slug}`}
                    onClick={() => onSelectTopic?.(topic)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium transition"
                  >
                    <TopicIcon slug={topic.slug} name={topic.name} className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 shrink-0" />
                    <span>{topic.name}</span>
                    {topic._count && (
                      <span className="text-[10px] text-slate-400 font-mono">({topic._count.deals})</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* View All Footer */}
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
            >
              <span>See all matching results for &ldquo;{query}&rdquo;</span>
              <span>➔</span>
            </button>
          )}
        </div>
      ) : (
        <div className="p-6 text-center space-y-1">
          <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
            No instant matches for &ldquo;{query}&rdquo;
          </p>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">
            Press Enter to perform a full catalog search
          </p>
        </div>
      )}
    </div>
  );
}
