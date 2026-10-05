import Link from 'next/link';
import TopicIcon from './TopicIcon';

interface TopicItem {
  id: string;
  name: string;
  slug: string;
  _count?: {
    deals: number;
  };
}

interface TopicFilterBarProps {
  topics: TopicItem[];
  activeTopic?: string;
  currentSort?: string;
  searchQuery?: string;
}

export default function TopicFilterBar({
  topics,
  activeTopic,
  currentSort,
  searchQuery,
}: TopicFilterBarProps) {
  const buildUrl = (topicSlug?: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (topicSlug) params.set('topic', topicSlug);
    if (currentSort && currentSort !== 'latest') params.set('sort', currentSort);
    const qs = params.toString();
    return qs ? `/?${qs}#curated-deals` : '/#curated-deals';
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-zinc-500"></span>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300">
            Browse by Topic
          </span>
        </div>
        <Link
          href="/topics"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition flex items-center gap-1"
        >
          <span>Explore all 12 categories</span>
          <span>&rarr;</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {/* All Deals Pill */}
        <Link
          href={buildUrl(undefined)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
            !activeTopic
              ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border border-slate-900 dark:border-white shadow-xs'
              : 'bg-white dark:bg-[#111114] border border-slate-200/80 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 hover:border-slate-350 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span>All Perks</span>
        </Link>

        {/* Topic Pills */}
        {topics.map((t) => {
          const isActive = activeTopic === t.slug;
          const count = t._count?.deals ?? 0;
          return (
            <Link
              key={t.id}
              href={buildUrl(isActive ? undefined : t.slug)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border border-slate-900 dark:border-white shadow-xs'
                  : 'bg-white dark:bg-[#111114] border border-slate-200/80 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 hover:border-slate-350 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium'
              }`}
            >
              <TopicIcon
                slug={t.slug}
                name={t.name}
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-white dark:text-zinc-950'
                    : 'text-slate-700 dark:text-zinc-300'
                }`}
              />
              <span>{t.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'text-slate-200 bg-slate-800 dark:bg-zinc-200 dark:text-zinc-900 font-bold'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold'
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
