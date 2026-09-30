import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Paradox Terms of Service. Understand the terms, disclaimers, merchant relationships, and conditions governing the use of our developer deal directory.',
  alternates: {
    canonical: SITE_URL + '/terms',
  },
  openGraph: {
    title: 'Terms of Service | Paradox',
    description:
      'Understand the terms, deal disclaimers, merchant relationships, and policies governing the use of Paradox.',
    url: SITE_URL + '/terms',
    siteName: 'Paradox',
    type: 'article',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service | Paradox',
  description:
    'Terms and conditions governing the use of the Paradox developer deals and software discount directory.',
  url: SITE_URL + '/terms',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Paradox',
    url: SITE_URL,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-white transition">
          Home
        </Link>
        <span className="text-slate-300 dark:text-zinc-600">/</span>
        <span className="text-slate-900 dark:text-white font-semibold">Terms of Service</span>
      </nav>

      {/* Page Header */}
      <header className="pb-6 border-b border-slate-200 dark:border-zinc-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800/80 dark:text-indigo-300">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Platform Terms & Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          Please read these Terms of Service carefully before browsing or utilizing the deals, coupons, and directory services offered by Paradox.
        </p>
        <div className="pt-2 text-xs text-slate-400 dark:text-zinc-500 font-medium">
          Last Updated: March 30, 2026 • Effective Date: January 1, 2026
        </div>
      </header>

      {/* Main Terms Articles */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
        
        {/* Section 1: Agreement to Terms */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">📜</span>
            <h2>1. Acceptance of Terms</h2>
          </div>
          <p>
            By accessing or browsing Paradox (<span className="font-semibold text-slate-900 dark:text-white">paradox.engineer</span>), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our{' '}
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Privacy Policy
            </Link>
            . If you disagree with any part of these terms, you should discontinue use of the site immediately.
          </p>
        </section>

        {/* Section 2: Directory Nature */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🏢</span>
            <h2>2. Nature of the Service</h2>
          </div>
          <p>
            Paradox is a free, publicly accessible informational aggregator and discovery platform. We research, aggregate, curate, and verify promotional discounts, software grants, developer credits, student tiers, and cloud coupons across 150+ technology brands.
          </p>
          <p>
            Paradox is <strong>not</strong> a direct retailer, software developer, or payment gateway. We do not sell software licenses directly to end-users. All software purchases, account activations, and credit applications are conducted directly on the official websites of the respective third-party merchants.
          </p>
        </section>

        {/* Section 3: Accuracy, Availability & No Guarantee */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">⚠️</span>
            <h2>3. Deal Accuracy, Expirations & Disclaimers</h2>
          </div>
          <p>
            While we diligently verify deals through automated health checks and manual testing, third-party merchants may alter, revoke, pause, or expire promotions, pricing tiers, eligibility criteria, or coupon codes at their sole discretion at any time without notifying us.
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
            <li><strong>As-Is Basis:</strong> All content, coupons, links, and perk descriptions are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis with no warranties of any kind, whether express or implied.</li>
            <li><strong>Merchant Discretion:</strong> The terms, eligibility, refund policies, and pricing listed on the merchant&rsquo;s official website always supersede any information presented on Paradox.</li>
            <li><strong>Reporting Expired Deals:</strong> If you discover a promo code that is no longer honored or has expired, please report it via our{' '}
            <Link href="/submit" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Submit / Feedback tool
            </Link>{' '}
            so our editors can promptly update the catalog.</li>
          </ul>
        </section>

        {/* Section 4: Affiliate & Advertising Relationship */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🤝</span>
            <h2>4. Affiliate Links & Advertising Disclosure</h2>
          </div>
          <p>
            Paradox participates in affiliate marketing programs (including Skimlinks and direct SaaS affiliate programs) and displays advertisements via Google AdSense. Some outbound links may earn us an affiliate commission when you claim an offer or register for an account, at zero extra cost to you.
          </p>
          <p>
            For a comprehensive breakdown of our commercial partnerships and strict editorial independence policy, please read our{' '}
            <Link href="/affiliate-disclosure" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Affiliate Disclosure
            </Link>.
          </p>
        </section>

        {/* Section 5: Trademarks & Fair Use */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🏷️</span>
            <h2>5. Intellectual Property & Trademarks</h2>
          </div>
          <p>
            All company names, brand names, product logos, and registered trademarks featured on Paradox (including, without limitation, Claude, DigitalOcean, Vultr, AWS, PostHog, JetBrains, GitHub, and others) are the property of their respective owners.
          </p>
          <p>
            Their inclusion on Paradox is solely for purposes of nominative fair use, truthful identification, editorial review, and comparative deal indexing. It does not imply affiliation with, sponsorship by, or endorsement of Paradox by those trademark owners unless explicitly noted.
          </p>
          <p>
            The Paradox name, website design, curation layout, and software codebase are protected by copyright and intellectual property laws.
          </p>
        </section>

        {/* Section 6: User Conduct */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🛡️</span>
            <h2>6. User Conduct & Deal Submissions</h2>
          </div>
          <p>
            When utilizing Paradox or submitting deals via our forms, you agree not to:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
            <li>Submit fraudulent, deceptive, pirated, or malicious coupon links, malware, or phishing campaigns.</li>
            <li>Submit spam or unauthorized multi-level marketing affiliate promotions.</li>
            <li>Deploy automated bots, spiders, or scrapers in an abusive manner that burdens site infrastructure.</li>
            <li>Attempt to bypass site security, exploit vulnerabilities, or disrupt normal server operation.</li>
          </ul>
        </section>

        {/* Section 7: Limitation of Liability */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">⚖️</span>
            <h2>7. Limitation of Liability</h2>
          </div>
          <p>
            To the maximum extent permitted by applicable law, Paradox and its maintainers shall not be liable for any indirect, incidental, punitive, consequential, or special damages arising out of or in connection with:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
            <li>Your access to or inability to access our directory.</li>
            <li>Any expired, discontinued, or non-functional deal, promotion, or coupon code.</li>
            <li>Transactions, dispute resolutions, or software performance issues between you and any third-party merchant.</li>
            <li>Any unauthorized access to our servers or transmission interruptions.</li>
          </ul>
        </section>

        {/* Section 8: Changes & Contact */}
        <section className="space-y-3 bg-slate-50 dark:bg-zinc-900/90 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Questions Regarding Terms
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            We reserve the right to revise these terms at any time. Material updates will be reflected with a revised &ldquo;Last Updated&rdquo; date at the top of this document. For inquiries:
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
              href="/privacy"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
            >
              <span>View Privacy Policy</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
