import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Paradox Privacy Policy. Learn how we collect, use, and protect your information, including Google AdSense cookies and affiliate tracking disclosures.',
  alternates: {
    canonical: SITE_URL + '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Paradox',
    description:
      'Learn how Paradox protects your personal data, handles cookies, and maintains transparency regarding Google AdSense and affiliate partnerships.',
    url: SITE_URL + '/privacy',
    siteName: 'Paradox',
    type: 'article',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy | Paradox',
  description:
    'Paradox Privacy Policy detailing data handling, cookies, Google AdSense compliance, and affiliate tracking.',
  url: SITE_URL + '/privacy',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Paradox',
    url: SITE_URL,
  },
};

export default function PrivacyPolicyPage() {
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
        <span className="text-slate-900 dark:text-white font-semibold">Privacy Policy</span>
      </nav>

      {/* Page Header */}
      <header className="pb-6 border-b border-slate-200 dark:border-zinc-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800/80 dark:text-indigo-300">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Privacy & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          At Paradox (<span className="font-semibold text-slate-900 dark:text-white">paradox.engineer</span>), we respect your privacy and are committed to safeguarding your personal data in accordance with applicable global data privacy regulations.
        </p>
        <div className="pt-2 text-xs text-slate-400 dark:text-zinc-500 font-medium">
          Last Updated: March 30, 2026 • Effective Date: January 1, 2026
        </div>
      </header>

      {/* Main Privacy Articles */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
        
        {/* Section 1: Overview */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">📋</span>
            <h2>1. Overview and Scope</h2>
          </div>
          <p>
            This Privacy Policy explains how Paradox (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, stores, and protects information when you browse our website, use our developer deal directory, subscribe to our email newsletter, or submit deal tips.
          </p>
          <p>
            By using Paradox, you agree to the collection and use of information in accordance with this policy. If you have any questions or require further clarification, please contact us at{' '}
            <a href="mailto:pradhumansingh196@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              pradhumansingh196@gmail.com
            </a>.
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🔍</span>
            <h2>2. Information We Collect</h2>
          </div>
          <p>
            We only collect information necessary to operate, improve, and secure our directory:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
            <li>
              <strong>Information You Provide Voluntarily:</strong> When you subscribe to our deal newsletter or submit a discount through our &ldquo;Submit a Deal&rdquo; form, we collect your email address and any submitted deal details. We never sell or rent your email address.
            </li>
            <li>
              <strong>Log Files & Technical Data:</strong> Like most standard websites, our hosting servers automatically log standard web requests. This includes your IP address, browser type and version, referring and exit pages, operating system, timestamp, and requested URLs to ensure site uptime, performance, and security.
            </li>
            <li>
              <strong>Aggregated Analytics:</strong> We use privacy-conscious Google Analytics 4 to track overall traffic trends, popular deal categories, and site performance. This data is collected on an aggregated basis and does not identify individual visitors personally.
            </li>
          </ul>
        </section>

        {/* Section 3: Cookies & Advertising (Google AdSense Compliant) */}
        <section className="space-y-4 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🍪</span>
            <h2>3. Cookies, Google AdSense & Advertising Technologies</h2>
          </div>
          <p>
            Cookies are small text files stored on your device that help web services remember preferences and understand visitor interactions. We use the following types of cookies:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
            <li>
              <strong>Essential & Preference Cookies:</strong> We store your UI theme preference (Light or Dark mode) locally in your browser storage so that your visual experience remains consistent across sessions.
            </li>
            <li>
              <strong>Google AdSense & Third-Party Advertising:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&rsquo;s prior visits to our website or other websites on the Internet.
            </li>
            <li>
              <strong>Google&rsquo;s Use of Advertising Cookies:</strong> Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to our users based on their visits to Paradox and/or other sites across the World Wide Web.
            </li>
            <li>
              <strong>Opting Out of Personalized Ads:</strong> You may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Google Ads Settings
              </a>. Alternatively, you can opt out of a third-party vendor&rsquo;s use of cookies for personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                aboutads.info/choices
              </a>.
            </li>
          </ul>
          <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200/80 dark:bg-indigo-950/40 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
            <strong>Managing Cookies:</strong> You can choose to disable or selectively turn off our cookies or third-party cookies in your browser settings. However, this may affect how you are able to interact with our site as well as other websites.
          </div>
        </section>

        {/* Section 4: Affiliate Tracking & Cuelinks */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🔗</span>
            <h2>4. Affiliate Tracking & Merchant Referrals</h2>
          </div>
          <p>
            Paradox participates in affiliate marketing programs, including direct merchant affiliate programs and performance marketing networks such as Cuelinks.
          </p>
          <p>
            When you click on outbound buttons such as &ldquo;Claim Deal&rdquo; or &ldquo;Visit Website&rdquo;, affiliate tracking parameters or redirect links record that Paradox referred you to the merchant&rsquo;s site. If you complete a qualifying signup or purchase, the merchant pays Paradox a referral commission at zero extra cost to you.
          </p>
          <p>
            These tracking technologies record referral timestamps and deal identifiers, but do not collect credit card numbers, passwords, or personal billing credentials from your merchant interaction. For full details on our editorial standards, read our{' '}
            <Link href="/affiliate-disclosure" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Affiliate Disclosure
            </Link>.
          </p>
        </section>

        {/* Section 5: How We Use Information */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">⚙️</span>
            <h2>5. How We Use Your Information</h2>
          </div>
          <p>We use collected data solely for the following legitimate purposes:</p>
          <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
            <li>Operating, optimizing, and maintaining the fast search, filtering, and catalog features of Paradox.</li>
            <li>Delivering our weekly deal digest if you explicitly opted into newsletter notifications.</li>
            <li>Reviewing, verifying, and publishing community-submitted deals and bug reports.</li>
            <li>Detecting, preventing, and addressing technical issues, malicious crawling, or fraudulent activities.</li>
          </ul>
        </section>

        {/* Section 6: Third-Party Links */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🌐</span>
            <h2>6. Third-Party Websites & Merchants</h2>
          </div>
          <p>
            Paradox contains direct links to third-party merchant platforms, software providers, cloud services, and educational programs. Once you click an outbound link and leave our domain, our Privacy Policy no longer applies. We encourage you to review the privacy policies and terms of any third-party service before submitting personal or financial information.
          </p>
        </section>

        {/* Section 7: User Rights (GDPR & CCPA) */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">🛡️</span>
            <h2>7. Your Privacy Rights (GDPR & CCPA / CPRA)</h2>
          </div>
          <p>
            Depending on your jurisdiction (such as the European Union or California), you may hold statutory privacy rights, including:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
            <li><strong>Right of Access:</strong> Request a copy of any personal data we hold about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete personal information.</li>
            <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request immediate deletion of your email address from our subscriber database.</li>
            <li><strong>Right to Opt-Out / Do Not Sell:</strong> Paradox does not sell personal information to third parties under any circumstances.</li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            To exercise any of these rights, please email{' '}
            <a href="mailto:pradhumansingh196@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              pradhumansingh196@gmail.com
            </a>{' '}
            with your request. We respond within 30 days.
          </p>
        </section>

        {/* Section 8: Children's Privacy */}
        <section className="space-y-3 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="text-lg">👶</span>
            <h2>8. Children&rsquo;s Privacy</h2>
          </div>
          <p>
            Paradox is intended for software developers, founders, and students who have reached the age of majority or have parental permission. We do not knowingly collect personal identifiable information from children under 13. If we discover that a child under 13 has provided personal data, we delete it immediately.
          </p>
        </section>

        {/* Section 9: Contact */}
        <section className="space-y-3 bg-slate-50 dark:bg-zinc-900/90 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Contact Paradox Privacy Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            For privacy inquiries, data deletion requests, or questions regarding our compliance with Google AdSense and advertising standards:
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
              href="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-zinc-700 transition"
            >
              <span>About Paradox</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
