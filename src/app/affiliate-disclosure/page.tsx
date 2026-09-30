import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure & Transparency',
  description:
    'Full transparency on how Paradox operates, our editorial independence, and affiliate monetization policies.',
  alternates: {
    canonical: SITE_URL + '/affiliate-disclosure',
  },
  openGraph: {
    title: 'Affiliate Disclosure & Reader Transparency',
    description:
      'Transparency on how Paradox operates, our editorial independence, and affiliate monetization policies.',
    url: SITE_URL + '/affiliate-disclosure',
    siteName: 'Paradox',
    type: 'article',
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 font-sans">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-white transition">Home</Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <span className="text-slate-900 dark:text-white font-semibold">Affiliate Disclosure</span>
      </nav>

      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-zinc-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800/80 dark:text-indigo-300">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Reader Transparency & Trust</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Affiliate Disclosure & Monetization Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          Transparency is a non-negotiable core value at Paradox. We believe software engineers, founders, and students deserve complete clarity on how our platform is funded and how our deal curation remains strictly independent.
        </p>
        <div className="pt-2 text-xs text-slate-400 dark:text-zinc-500 font-medium">
          Last Updated: March 28, 2026 • Effective Date: January 1, 2026
        </div>
      </div>

      {/* Main Content Articles */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
        {/* Section 1: How We Earn Revenue */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">💰</span>
            <h2>How Paradox Earns Money</h2>
          </div>
          <p>
            Paradox (<span className="font-semibold text-slate-900 dark:text-white">paradox.engineer</span>) is a reader-supported deal aggregator and developer perk catalog. When you click on buttons such as &ldquo;Claim Deal&rdquo;, &ldquo;Get Code&rdquo;, or &ldquo;Visit Website&rdquo; and subsequently sign up for a plan, activate an account, or complete a purchase on a merchant&rsquo;s website, we may receive an affiliate referral commission or bounty.
          </p>
          <p>
            We monetize through direct SaaS affiliate partnerships as well as automated affiliate technology networks . 
          </p>
          <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200/80 dark:bg-indigo-950/40 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
            <strong>Important Guarantee:</strong> Clicking our affiliate links or using our discount promo codes <strong>never costs you a single extra cent</strong>. In fact, our verified deals and exclusive partner promotions typically grant you lower subscription fees, longer trial windows, or complementary cloud credits that are unavailable through standard signup pages.
          </div>
        </section>

        {/* Section 2: Editorial Independence */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">⚖️</span>
            <h2>Our Editorial Independence & Quality Standards</h2>
          </div>
          <p>
            Our commercial relationships <strong>never dictate what deals are published, featured, or recommended</strong>. Our editorial criteria are straightforward:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
            <li>
              <strong>Value-First Curation:</strong> We feature developer tools, cloud providers, and learning platforms because they offer genuine utility, substantial savings, or generous free tiers—not because of commission payouts.
            </li>
            <li>
              <strong>Unmonetized Free Resources:</strong> More than half of the perks listed on Paradox (including many open-source grants, university student tiers, and community freebies) provide zero financial compensation to us. We list them because they benefit developers.
            </li>
            <li>
              <strong>No Paid Reviews or Endorsements:</strong> We do not accept payment to write deceptive positive reviews or feature malicious software.
            </li>
            <li>
              <strong>Verification Before Publication:</strong> Every deal undergoes manual or automated verification against live provider documentation before being marked with the &ldquo;Verified Active&rdquo; badge.
            </li>
          </ul>
        </section>

        {/* Section 3: How Promo Codes and Affiliate Links Work Together */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🎟️</span>
            <h2>How Promo Codes Work With Affiliate Tracking</h2>
          </div>
          <p>
            Many of our deals feature explicit coupon codes (e.g. <code>CLOUD40</code> for Cloudways). When you click the deal button, two complementary events occur:
          </p>
          <ol className="space-y-2 list-decimal pl-5 text-xs sm:text-sm">
            <li>
              <strong>Tracking Cookie:</strong> A secure referring cookie is stored by the merchant or affiliate network indicating that Paradox introduced you to the platform.
            </li>
            <li>
              <strong>Checkout Discount:</strong> When you enter the coupon code during checkout, you receive the full promotional discount, and the merchant attributes the successful conversion to Paradox.
            </li>
          </ol>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            If you use ad-blockers or privacy extensions that strip referrer headers, the discount code will still work for you, but we may not receive credit for the referral.
          </p>
        </section>

      

        {/* Section 5: Reader Promise */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">✨</span>
            <h2>Our Reader Promise</h2>
          </div>
          <p className="text-xs sm:text-sm">
            We are dedicated to building a trustworthy, transparent perks directory for developers, founders, and students worldwide. Whenever you use a link or claim an offer on Paradox, you can rest assured that you are accessing the authentic, verified landing page without hidden charges, unexpected traps, or inflated costs.
          </p>
        </section>

        {/* Section 6: Questions & Contact */}
        <section className="space-y-3 bg-slate-50 dark:bg-zinc-900/90 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Have Questions or Want to Partner?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            If you have questions regarding our monetization policies, or represent a software company that would like to provide exclusive discounts to our developer community, please get in touch directly:
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="mailto:pradhumansingh196@gmail.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-xs shadow-indigo-500/25 transition"
            >
              <span>✉️</span>
              <span>pradhumansingh196@gmail.com</span>
            </a>
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
            >
              <span>+ Submit a New Perk</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
