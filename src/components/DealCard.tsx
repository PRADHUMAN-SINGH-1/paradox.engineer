import Link from 'next/link';
import BrandLogo from './BrandLogo';
import ExpiryBadge from './ExpiryBadge';
import PromoCodeBadge from './PromoCodeBadge';

interface DealCardProps {
  deal: {
    title: string;
    shortDescription: string;
    slug: string;
    dealType: string;
    discountAmount: string;
    promoCode?: string | null;
    clickCount: number;
    isTrending: boolean;
    isLimitedTime: boolean;
    isStudentDeal: boolean;
    isStartupDeal: boolean;
    needsCreditCard: boolean;
    expiryDate?: Date | string | null;
    brand: {
      name: string;
      slug: string;
      logoUrl?: string | null;
      website?: string | null;
    };
    topic?: {
      name: string;
    };
  };
}

export default function DealCard({ deal }: DealCardProps) {
  return (
    <div className="group relative bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-blue-400/80 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0 relative z-10">
            <Link
              href={`/brands/${deal.brand.slug}`}
              className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/60 p-1 flex items-center justify-center shrink-0 hover:border-blue-400 transition"
              title={`View ${deal.brand.name} perks`}
            >
              <BrandLogo
                name={deal.brand.name}
                logoUrl={deal.brand.logoUrl}
                website={deal.brand.website}
                size="sm"
              />
            </Link>
            <div className="min-w-0 truncate">
              <Link 
                href={`/brands/${deal.brand.slug}`}
                className="text-xs font-bold text-slate-900 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-white transition truncate block"
              >
                {deal.brand.name}
              </Link>
              {deal.topic && (
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 block truncate">
                  {deal.topic.name}
                </span>
              )}
            </div>
          </div>

          <div className="relative z-10">
            <ExpiryBadge expiryDate={deal.expiryDate} isLimitedTime={deal.isLimitedTime} />
          </div>
        </div>

        {/* Title & Short Description with Stretched Link covering whole card */}
        <Link 
          href={`/resources/${deal.slug}`} 
          className="block group mb-3 before:absolute before:inset-0 before:z-0 before:rounded-2xl"
        >
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1 leading-snug">
            {deal.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed font-normal">
            {deal.shortDescription}
          </p>
        </Link>
      </div>

      <div>
        {/* Value / Discount / Code */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 relative z-10">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg shadow-2xs">
            {deal.discountAmount}
          </span>
          {deal.promoCode && (
            <PromoCodeBadge code={deal.promoCode} />
          )}
        </div>

        {/* Footer Technical Indicators */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/70 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 relative z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {deal.isStudentDeal && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-zinc-800 dark:text-blue-300 font-medium text-[10px]">
                Student
              </span>
            )}
            {!deal.needsCreditCard && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-zinc-800 dark:text-emerald-300 font-medium text-[10px]">
                No Credit Card
              </span>
            )}
            {deal.isTrending && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 font-medium text-[10px]">
                Trending
              </span>
            )}
          </div>

          <div className="shrink-0 font-medium">
            {deal.clickCount.toLocaleString()} claims
          </div>
        </div>
      </div>
    </div>
  );
}
