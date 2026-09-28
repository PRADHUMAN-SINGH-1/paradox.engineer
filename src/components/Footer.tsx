import Link from 'next/link';
import NewsletterSignup from './NewsletterSignup';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#09090b] text-slate-600 dark:text-zinc-400 mt-auto border-t border-slate-200 dark:border-zinc-800 transition-colors font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Newsletter & Headline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-slate-100 dark:border-zinc-800 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-sm font-bold text-slate-900 dark:text-white">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Stay Ahead with Paradox Deals</span>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 text-xs max-w-sm leading-relaxed">
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
            <h4 className="font-bold mb-3 text-slate-900 dark:text-white text-xs">Popular Deals</h4>
            <ul className="space-y-2">
              <li><Link href="/resources/claude-for-oss" className="hover:text-blue-600 dark:hover:text-white transition">Claude for Open Source</Link></li>
              <li><Link href="/resources/vultr-free-credits" className="hover:text-blue-600 dark:hover:text-white transition">Vultr $250 Cloud Credits</Link></li>
              <li><Link href="/resources/digitalocean-credits" className="hover:text-blue-600 dark:hover:text-white transition">DigitalOcean $200 Credits</Link></li>
              <li><Link href="/resources/posthog-for-startups" className="hover:text-blue-600 dark:hover:text-white transition">PostHog $50k Startup Grant</Link></li>
              <li><Link href="/resources/cursor-pro-trial" className="hover:text-blue-600 dark:hover:text-white transition">Cursor Pro 14-Day AI Trial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-slate-900 dark:text-white text-xs">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/topics/ai" className="hover:text-blue-600 dark:hover:text-white transition">AI & Foundation Models</Link></li>
              <li><Link href="/topics/vibe-coding" className="hover:text-blue-600 dark:hover:text-white transition">Developer Tooling</Link></li>
              <li><Link href="/topics/cloud-storage" className="hover:text-blue-600 dark:hover:text-white transition">Cloud Databases & Storage</Link></li>
              <li><Link href="/topics/hosting-domains" className="hover:text-blue-600 dark:hover:text-white transition">Domains & Web Hosting</Link></li>
              <li><Link href="/topics/courses-and-certifications" className="hover:text-blue-600 dark:hover:text-white transition">Courses & Certifications</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-slate-900 dark:text-white text-xs">Quick Access</h4>
            <ul className="space-y-2">
              <li><Link href="/latest" className="hover:text-blue-600 dark:hover:text-white transition">Latest New Arrivals</Link></li>
              <li><Link href="/student" className="hover:text-blue-600 dark:hover:text-white transition">Student Discounts (.edu)</Link></li>
              <li><Link href="/startups" className="hover:text-blue-600 dark:hover:text-white transition">Startup Programs & Credits</Link></li>
              <li><Link href="/no-credit-card" className="hover:text-blue-600 dark:hover:text-white transition">No Credit Card Needed</Link></li>
              <li><Link href="/brands" className="hover:text-blue-600 dark:hover:text-white transition">Browse All 156+ Brands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-slate-900 dark:text-white text-xs">Platform & Trust</h4>
            <ul className="space-y-2">
              <li><Link href="/submit" className="hover:text-blue-600 dark:hover:text-white transition">Submit a New Perk</Link></li>
              <li><Link href="/category/freebies" className="hover:text-blue-600 dark:hover:text-white transition">Free Developer Vault</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-white transition">About & Verification</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-blue-600 dark:hover:text-white transition">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        {/* Reader Transparency Notice matching Resourify */}
        <div className="py-4 px-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 dark:text-zinc-400 gap-2">
          <p>
            This site is reader-supported. We may earn an affiliate commission when you claim deals or purchase through our links at no extra cost to you.
          </p>
          <Link
            href="/affiliate-disclosure"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline shrink-0"
          >
            Read our Affiliate Disclosure &rarr;
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center text-slate-500 dark:text-zinc-500 text-xs gap-3">
          <p>© 2026 Paradox. All rights reserved. Curated digital deals, verified coupons & developer discounts.</p>
          <div className="flex gap-4 text-xs items-center">
            <span className="hover:text-slate-800 dark:hover:text-zinc-300 transition cursor-default">Verified Active Deals</span>
            <span>•</span>
            <span className="hover:text-slate-800 dark:hover:text-zinc-300 transition cursor-default">Zero Redirect Traps</span>
            <span>•</span>
            <Link href="/affiliate-disclosure" className="hover:text-blue-600 dark:hover:text-white transition font-medium text-slate-700 dark:text-zinc-300">
              Affiliate Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
