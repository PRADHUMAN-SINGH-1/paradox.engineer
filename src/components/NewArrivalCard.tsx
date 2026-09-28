import Link from 'next/link';
import BrandLogo from './BrandLogo';

interface NewArrivalCardProps {
  deal: {
    title: string;
    slug: string;
    dealType: string;
    discountAmount: string | null;
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
  };
}

export default function NewArrivalCard({ deal }: NewArrivalCardProps) {
  return (
    <Link
      href={`/resources/${deal.slug}`}
      className="group bg-white dark:bg-zinc-900/60 hover:bg-slate-50/70 dark:hover:bg-zinc-900 border border-slate-200/80 hover:border-blue-400/70 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-2xl p-4 transition-all duration-200 flex items-center gap-4 shadow-xs hover:shadow-md"
    >
      {/* Prominent Brand Logo Box */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700/60 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
        <BrandLogo
          name={deal.brand.name}
          logoUrl={deal.brand.logoUrl}
          website={deal.brand.website}
          size="lg"
        />
      </div>

      {/* Deal Information */}
      <div className="flex-1 min-w-0">
        {/* Header Row: Brand Name + Badges + Discount Value */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
              {deal.brand.name}
            </span>

            {deal.isStartupDeal && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
                <span>🚀</span> Startup
              </span>
            )}

            {deal.isStudentDeal && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
                <span>🎓</span> Student
              </span>
            )}

            {deal.isTrending && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                <span>📈</span> Trending
              </span>
            )}

            {deal.isLimitedTime && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                <span>⏱️</span> Limited Time
              </span>
            )}
          </div>

          {deal.discountAmount && (
            <span className="text-xs font-medium text-slate-600 dark:text-zinc-400 shrink-0">
              {deal.discountAmount}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
          {deal.title}
        </h4>
      </div>
    </Link>
  );
}
