import Link from 'next/link';
import BrandLogo from './BrandLogo';
import PromoCodeBadge from './PromoCodeBadge';

interface FeaturedDeal {
  id: string;
  title: string;
  shortDescription: string;
  slug: string;
  dealType: string;
  discountAmount: string;
  promoCode?: string | null;
  clickCount: number;
  isTrending?: boolean;
  brand: {
    name: string;
    slug: string;
    logoUrl?: string | null;
    website?: string | null;
  };
  topic?: {
    name: string;
  };
}

interface FeaturedPerksSpotlightProps {
  deals: FeaturedDeal[];
}

function formatDealTitle(title: string, brandName: string): string {
  const brand = (brandName || '').trim();
  if (!brand) return title;
  const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedBrand}\\s*[:\\-\\–\\—\\|]\\s*`, 'i');
  return title.replace(regex, '').trim() || title;
}

function getDiscountBadgeClasses(discountAmount?: string | null, dealType?: string) {
  const text = (discountAmount || '').toLowerCase();
  const type = (dealType || '').toLowerCase();

  if (text.includes('free') || type === 'freebie') {
    return {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
      icon: 'text-emerald-600 dark:text-emerald-400',
    };
  }
  if (text.includes('credit') || text.includes('$') || type === 'credit') {
    return {
      container: 'bg-indigo-50 text-indigo-700 border-indigo-200/90 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
      icon: 'text-indigo-600 dark:text-indigo-400',
    };
  }
  if (text.includes('%') || text.includes('off') || type === 'discount') {
    return {
      container: 'bg-indigo-50 text-indigo-700 border-indigo-200/90 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
      icon: 'text-indigo-600 dark:text-indigo-400',
    };
  }
  if (text.includes('trial') || type === 'trial') {
    return {
      container: 'bg-indigo-50 text-indigo-700 border-indigo-200/90 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60',
      icon: 'text-indigo-600 dark:text-indigo-400',
    };
  }
  return {
    container: 'bg-indigo-50 text-indigo-700 border-indigo-200/90 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60',
    icon: 'text-indigo-600 dark:text-indigo-400',
  };
}

export default function FeaturedPerksSpotlight({ deals }: FeaturedPerksSpotlightProps) {
  if (!deals || deals.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* Sleek Minimalist Section Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300">
            Featured Cloud & AI Grants
          </h2>
        </div>
        <Link
          href="/category/credits"
          className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition flex items-center gap-1"
        >
          <span>All grants & credits</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* Modern High-Impact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {deals.map((deal) => {
          const brandName = deal.brand?.name || 'Partner';
          const brandSlug = deal.brand?.slug || 'partner';
          const title = formatDealTitle(deal.title, brandName);
          const badgeStyle = getDiscountBadgeClasses(deal.discountAmount, deal.dealType);
          return (
            <div
              key={deal.id}
              className="group relative rounded-2xl bg-white dark:bg-[#111114] border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-350 dark:hover:border-white/20 p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
            >
              {/* Subtle top accent highlight on hover (sleek indigo accent) */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

              <div>
                {/* Brand & Status Bar */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                    <Link
                      href={`/brands/${brandSlug}`}
                      className="shrink-0 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 transition-transform active:scale-95"
                      title={`View ${brandName} perks`}
                    >
                      <BrandLogo
                        name={brandName}
                        logoUrl={deal.brand?.logoUrl}
                        website={deal.brand?.website}
                        size="md"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/brands/${brandSlug}`}
                        className="text-[13px] font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate block"
                      >
                        {brandName}
                      </Link>
                      {deal.topic && (
                        <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium block truncate">
                          {deal.topic.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {deal.isTrending ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 shrink-0 shadow-2xs">
                      <span>Trending</span>
                      <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span>Active</span>
                    </span>
                  )}
                </div>

                {/* Title & Description with Stretched Link covering the card */}
                <Link
                  href={`/resources/${deal.slug}`}
                  className="block group/link mb-3.5 before:absolute before:inset-0 before:z-0 before:rounded-2xl"
                >
                  <h3 className="text-[15.5px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug tracking-tight mb-1 min-h-[2.5rem]">
                    {title}
                  </h3>
                  <p className="text-[13px] text-slate-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                    {deal.shortDescription}
                  </p>
                </Link>
              </div>

              {/* Perk Value & Action Row */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 relative z-10">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border shadow-2xs ${badgeStyle.container}`}>
                    <svg className={`w-3.5 h-3.5 shrink-0 ${badgeStyle.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="truncate">{deal.discountAmount}</span>
                  </div>
                  {deal.promoCode && (
                    <PromoCodeBadge code={deal.promoCode} />
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/90 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-indigo-600 dark:hover:text-white group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all shadow-2xs shrink-0">
                  <span>Claim</span>
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
