import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About Paradox & Deal Verification',
  description:
    'Learn how Paradox discovers, verifies, organizes, and updates developer deals, cloud credits, software discounts, and startup perks.',
  alternates: {
    canonical: SITE_URL + '/about',
  },
  openGraph: {
    title: 'About Paradox & Deal Verification',
    description:
      'How Paradox discovers, verifies, organizes, and updates developer deals and software perks.',
    url: SITE_URL + '/about',
    siteName: 'Paradox',
    type: 'article',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Paradox & Deal Verification',
  description:
    'How Paradox discovers, verifies, organizes, and updates developer deals and software perks.',
  url: SITE_URL + '/about',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Paradox',
    url: SITE_URL,
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-white transition">
          Home
        </Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <span className="text-slate-900 dark:text-white font-semibold">About</span>
      </nav>

      <header className="pb-6 border-b border-slate-200 dark:border-zinc-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800/80 dark:text-indigo-300">
          <span>◎</span>
          <span>Developer Deal Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About Paradox
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
          Paradox is a curated directory for developers, students, freelancers, and startup teams looking for software discounts, cloud credits, free tiers, trials, and promotional programs.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">What Paradox adds</h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            Offers are organized by brand, topic, and deal type so visitors can compare eligibility, value, credit-card requirements, and claim instructions before leaving the site.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            The directory also links related offers so visitors can discover alternatives instead of relying on a single provider.
          </p>
        </section>

        <section className="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">How offers are maintained</h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            Paradox combines automated deal discovery, expiry checks, community submissions, and editorial review. Active offers are refreshed as source information changes and expired offers are removed from the public directory.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            Eligibility can vary by country, account type, student status, or campaign period, so the provider's official terms remain the final source of truth.
          </p>
        </section>
      </div>

      <section className="bg-white dark:bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">How we approach affiliate links</h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          Some outbound links may be monetized through affiliate partnerships or networks such as Cuelinks. This does not change the deal data shown on the page, and visitors do not pay an additional fee because Paradox receives a referral.
        </p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          For details on commissions, tracking, and editorial independence, see our
          {' '}
          <Link href="/affiliate-disclosure" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Affiliate Disclosure
          </Link>.
        </p>
      </section>

      <section className="bg-slate-50 dark:bg-zinc-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Help improve the directory</h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          Found a new promotion or an offer that has expired? Send the details through
          {' '}
          <Link href="/submit" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Submit a Deal
          </Link>
          {' '}
          and the Paradox team can review it for inclusion or removal.
        </p>
      </section>
    </div>
  );
}
