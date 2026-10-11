import Link from 'next/link';
import NewsletterSignup from './NewsletterSignup';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#09090b] text-slate-800 dark:text-zinc-200 mt-auto border-t border-slate-200 dark:border-zinc-800 transition-colors font-sans pb-20 sm:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-6">
        {/* Newsletter & Headline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-slate-200 dark:border-zinc-800 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-sm font-extrabold text-slate-950 dark:text-white">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Stay Ahead with Paradox Deals</span>
            </div>
            <p className="text-slate-750 dark:text-zinc-200 text-xs font-medium max-w-sm leading-relaxed">
              Get the latest software discounts, cloud infrastructure credits, and developer tools delivered directly to your inbox weekly.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <NewsletterSignup />
          </div>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-xs">
          <div>
            <h3 className="font-extrabold mb-3 text-slate-950 dark:text-white text-xs tracking-tight">Popular Deals</h3>
            <ul className="space-y-2.5 font-semibold text-slate-900 dark:text-zinc-100">
              <li><Link href="/resources/claude-for-oss" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Claude for Open Source</Link></li>
              <li><Link href="/resources/vultr-free-credits" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Vultr $250 Cloud Credits</Link></li>
              <li><Link href="/resources/digitalocean-credits" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">DigitalOcean $200 Credits</Link></li>
              <li><Link href="/resources/posthog-for-startups" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">PostHog $50k Startup Grant</Link></li>
              <li><Link href="/resources/cursor-pro-trial" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Cursor Pro 14-Day AI Trial</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-extrabold mb-3 text-slate-950 dark:text-white text-xs tracking-tight">Categories</h3>
            <ul className="space-y-2.5 font-semibold text-slate-900 dark:text-zinc-100">
              <li><Link href="/topics/ai" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">AI & Foundation Models</Link></li>
              <li><Link href="/topics/vibe-coding" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Developer Tooling</Link></li>
              <li><Link href="/topics/cloud-storage" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Cloud Databases & Storage</Link></li>
              <li><Link href="/topics/hosting-domains" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Domains & Web Hosting</Link></li>
              <li><Link href="/topics/courses-and-certifications" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Courses & Certifications</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-extrabold mb-3 text-slate-950 dark:text-white text-xs tracking-tight">Quick Access</h3>
            <ul className="space-y-2.5 font-semibold text-slate-900 dark:text-zinc-100">
              <li><Link href="/latest" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Latest New Arrivals</Link></li>
              <li><Link href="/student" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Student Discounts (.edu)</Link></li>
              <li><Link href="/startups" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Startup Programs & Credits</Link></li>
              <li><Link href="/no-credit-card" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">No Credit Card Needed</Link></li>
              <li><Link href="/brands" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Browse All Brands</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-extrabold mb-3 text-slate-950 dark:text-white text-xs tracking-tight">Platform & Trust</h3>
            <ul className="space-y-2.5 font-semibold text-slate-900 dark:text-zinc-100">
              <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">About & Verification</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Affiliate Disclosure</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms of Service</Link></li>
              <li><Link href="/submit" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Submit a New Perk</Link></li>
            </ul>
          </div>
        </div>

        {/* Reader Transparency Notice matching Resourify */}
        <div className="py-4 px-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-900 dark:text-zinc-100 font-semibold gap-2">
          <p>
            This site is reader-supported. We may earn an affiliate commission when you claim deals or purchase through our links at no extra cost to you.
          </p>
          <Link
            href="/affiliate-disclosure"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0"
          >
            Read our Affiliate Disclosure &rarr;
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center text-slate-800 dark:text-zinc-300 text-xs gap-3 font-medium">
          <p>© 2026 Paradox. All rights reserved. Curated digital deals, verified coupons & developer discounts.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs items-center justify-center md:justify-end font-semibold pr-0 md:pr-24 lg:pr-28 z-10 relative">
            <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-white transition text-slate-900 dark:text-zinc-200 py-1">
              Privacy Policy
            </Link>
            <span className="text-slate-400 dark:text-zinc-600">•</span>
            <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-white transition text-slate-900 dark:text-zinc-200 py-1">
              Terms of Service
            </Link>
            <span className="text-slate-400 dark:text-zinc-600">•</span>
            <Link href="/affiliate-disclosure" className="hover:text-indigo-600 dark:hover:text-white transition text-slate-900 dark:text-zinc-200 py-1">
              Affiliate Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
