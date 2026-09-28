'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';

export interface BrandData {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  website?: string | null;
  dealCount: number;
  trendingCount: number;
  totalClicks: number;
  totalViews: number;
  topicSlugs: string[];
  categorySlugs: string[];
}

export interface TopicOption {
  name: string;
  slug: string;
  dealCount: number;
}

export interface CategoryOption {
  name: string;
  slug: string;
  dealCount: number;
}

interface BrandsDirectoryClientProps {
  popularBrands: BrandData[];
  allBrands: BrandData[];
  topics: TopicOption[];
  categories: CategoryOption[];
}

const ALPHABET = [
  'All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'
];

export default function BrandsDirectoryClient({
  popularBrands,
  allBrands,
  topics,
  categories,
}: BrandsDirectoryClientProps) {
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<'trending' | 'popular' | 'deals' | 'name'>('trending');

  // Dropdown visibility states
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const topicRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topicRef.current && !topicRef.current.contains(e.target as Node)) {
        setTopicDropdownOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter & Sort All Brands
  const filteredAllBrands = useMemo(() => {
    let list = [...allBrands];

    // Filter by Letter
    if (selectedLetter !== 'All') {
      if (selectedLetter === '#') {
        list = list.filter((b) => /^[0-9]/.test(b.name));
      } else {
        const letterLower = selectedLetter.toLowerCase();
        list = list.filter((b) => b.name.toLowerCase().startsWith(letterLower));
      }
    }

    // Filter by Topic
    if (selectedTopic !== 'All') {
      list = list.filter((b) => b.topicSlugs.includes(selectedTopic));
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter((b) => b.categorySlugs.includes(selectedCategory));
    }

    // Sort
    list.sort((a, b) => {
      if (selectedSort === 'trending') {
        if (b.trendingCount !== a.trendingCount) return b.trendingCount - a.trendingCount;
        if (b.dealCount !== a.dealCount) return b.dealCount - a.dealCount;
        return a.name.localeCompare(b.name);
      }
      if (selectedSort === 'popular') {
        const scoreB = b.totalClicks * 2 + b.totalViews;
        const scoreA = a.totalClicks * 2 + a.totalViews;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.name.localeCompare(b.name);
      }
      if (selectedSort === 'deals') {
        if (b.dealCount !== a.dealCount) return b.dealCount - a.dealCount;
        return a.name.localeCompare(b.name);
      }
      // 'name'
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [allBrands, selectedLetter, selectedTopic, selectedCategory, selectedSort]);

  // Selected labels
  const activeTopicLabel = selectedTopic === 'All'
    ? 'Topic'
    : (topics.find((t) => t.slug === selectedTopic)?.name || 'Topic');

  const activeCategoryLabel = selectedCategory === 'All'
    ? 'Category'
    : (categories.find((c) => c.slug === selectedCategory)?.name || 'Category');

  const sortLabels: Record<string, string> = {
    trending: 'Sort: Trending',
    popular: 'Sort: Most Popular',
    deals: 'Sort: Most Deals',
    name: 'Sort: Name (A-Z)',
  };

  const hasActiveFilters = selectedLetter !== 'All' || selectedTopic !== 'All' || selectedCategory !== 'All';

  const resetFilters = () => {
    setSelectedLetter('All');
    setSelectedTopic('All');
    setSelectedCategory('All');
    setSelectedSort('trending');
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header section matching Resourify design */}
      <div className="space-y-3">
        <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition">Home</Link>
          <span className="text-slate-300 dark:text-zinc-600">/</span>
          <span className="text-slate-900 dark:text-white font-semibold">Brands</span>
        </nav>

        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Browse Deals by Brand
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            <p>
              Discover verified developer credits, cloud offers, and software discounts by provider.
            </p>
            <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
              Last updated 1 day ago
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-4">
        {/* Dropdowns row */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Topic Dropdown */}
          <div className="relative" ref={topicRef}>
            <button
              type="button"
              onClick={() => setTopicDropdownOpen(!topicDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition ${
                selectedTopic !== 'All'
                  ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <span>{activeTopicLabel}</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${topicDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {topicDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-40 max-h-80 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => { setSelectedTopic('All'); setTopicDropdownOpen(false); }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs transition flex items-center justify-between ${
                    selectedTopic === 'All' ? 'bg-slate-100 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <span>All Topics</span>
                </button>
                {topics.map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => { setSelectedTopic(t.slug); setTopicDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs transition flex items-center justify-between ${
                      selectedTopic === t.slug ? 'bg-slate-100 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 ml-2 font-mono">{t.dealCount}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition ${
                selectedCategory !== 'All'
                  ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <span>{activeCategoryLabel}</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {categoryDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-56 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-40">
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('All'); setCategoryDropdownOpen(false); }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs transition flex items-center justify-between ${
                    selectedCategory === 'All' ? 'bg-slate-100 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => { setSelectedCategory(c.slug); setCategoryDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs transition flex items-center justify-between ${
                      selectedCategory === c.slug ? 'bg-slate-100 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 ml-2 font-mono">{c.dealCount}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 font-medium hover:border-slate-300 dark:hover:border-zinc-700 transition"
            >
              <span>{sortLabels[selectedSort]}</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {sortDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-40">
                {(['trending', 'popular', 'deals', 'name'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setSelectedSort(s); setSortDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs transition ${
                      selectedSort === s
                        ? 'bg-slate-100 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    {sortLabels[s].replace('Sort: ', '')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium ml-1"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Alphabet Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {ALPHABET.map((char) => {
            const isActive = selectedLetter === char;
            return (
              <button
                key={char}
                type="button"
                onClick={() => setSelectedLetter(char)}
                className={`min-w-6 h-7 px-2 rounded-lg transition-all font-semibold shrink-0 text-center ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 1: Popular Brands (Shows all 39 Popular Brands unless filtered) */}
      {!hasActiveFilters && (
        <section className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Popular Brands
            </h2>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              {popularBrands.length} brands
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-3">
            {popularBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 hover:border-blue-400 dark:border-zinc-800 dark:hover:border-zinc-700 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                title={`${brand.name} (${brand.dealCount} active offers)`}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700/60 p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BrandLogo
                    name={brand.name}
                    logoUrl={brand.logoUrl}
                    website={brand.website}
                    size="card"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-white transition truncate w-full text-center mt-2.5">
                  {brand.name}
                </span>
                {brand.dealCount > 0 && (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    {brand.dealCount} {brand.dealCount === 1 ? 'deal' : 'deals'}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: All Brands (156 Brands) */}
      <section className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {hasActiveFilters ? 'Filtered Brands' : 'All Brands'}
          </h2>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            {filteredAllBrands.length} brands
          </span>
        </div>

        {filteredAllBrands.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-3">
            {filteredAllBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 hover:border-blue-400 dark:border-zinc-800 dark:hover:border-zinc-700 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                title={`${brand.name} (${brand.dealCount} active offers)`}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700/60 p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BrandLogo
                    name={brand.name}
                    logoUrl={brand.logoUrl}
                    website={brand.website}
                    size="card"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-white transition truncate w-full text-center mt-2.5">
                  {brand.name}
                </span>
                {brand.dealCount > 0 ? (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    {brand.dealCount} {brand.dealCount === 1 ? 'deal' : 'deals'}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-zinc-600 font-medium mt-0.5">
                    Verified
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8">
            <p className="text-3xl mb-3">🔍</p>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              No brands matching this letter filter.
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 mb-4">
              Try selecting &ldquo;All&rdquo; or a different category to view more companies.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Show All 156 Brands
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
