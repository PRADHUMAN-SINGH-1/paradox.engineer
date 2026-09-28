import { getPublicTopics } from '@/lib/public-data';
import TopicCard from '@/components/TopicCard';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'All Categories | Paradox',
  description: 'Explore developer perks, cloud grants, and software discounts across all technical domains.',
};

export default async function AllTopicsPage() {
  const topics = await getPublicTopics();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition font-medium">Home</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <span className="text-slate-900 dark:text-white font-semibold">Topics</span>
      </nav>

      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          Browse Deals by Topic
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Showing {topics.length} curated categories for developers, startups, and designers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {topics.map(topic => (
          <TopicCard key={topic.id} topic={topic as any} dealCount={topic._count.deals} />
        ))}
      </div>
    </div>
  );
}
