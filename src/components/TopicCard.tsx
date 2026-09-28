import Link from 'next/link';

interface TopicCardProps {
  topic: {
    name: string;
    slug: string;
    icon?: string | null;
    dealCount?: number;
    _count?: {
      deals: number;
    };
  };
  dealCount?: number;
}

export default function TopicCard({ topic, dealCount }: TopicCardProps) {
  const count = dealCount ?? topic.dealCount ?? topic._count?.deals ?? 0;

  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 transition shadow-2xs hover:shadow-xs"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700/60 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
        {topic.icon || '🏷️'}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors truncate leading-tight">
          {topic.name}
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
          {count} {count === 1 ? 'deal' : 'deals'} found
        </p>
      </div>
    </Link>
  );
}
