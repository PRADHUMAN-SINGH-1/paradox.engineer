import Link from 'next/link';
import TopicIcon from './TopicIcon';

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
      <div className="w-10 h-10 rounded-xl bg-slate-100/80 dark:bg-zinc-800 border border-slate-200/90 dark:border-zinc-700/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-slate-200/60 dark:group-hover:bg-zinc-700 group-hover:border-slate-300 dark:group-hover:border-zinc-600 transition-all">
        <TopicIcon
          slug={topic.slug}
          name={topic.name}
          className="w-5 h-5 text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400 transition-colors truncate leading-tight">
          {topic.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium font-sans mt-0.5">
          {count} {count === 1 ? 'deal' : 'deals'} found
        </p>
      </div>
    </Link>
  );
}
