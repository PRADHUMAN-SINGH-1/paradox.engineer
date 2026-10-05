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

function formatDealTitle(title: string, brandName: string): string {
  const brand = (brandName || '').trim();
  if (!brand) return title;
  const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedBrand}\\s*[:\\-\\–\\—\\|]\\s*`, 'i');
  const cleaned = title.replace(regex, '').trim();
  return cleaned || title;
}

export default function NewArrivalCard({ deal }: NewArrivalCardProps) {
  const brandName = deal.brand?.name || 'Partner';
  const displayTitle = formatDealTitle(deal.title, brandName);
  return (
    <Link
      href={`/resources/${deal.slug}`}
      className="group bg-white dark:bg-zinc-900/60 hover:bg-slate-50/70 dark:hover:bg-zinc-900 border border-slate-200/80 hover:border-slate-350 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-2xl p-4 transition-all duration-200 flex items-center gap-4 shadow-xs hover:shadow-md"
    >
      {/* Prominent Brand Logo Box */}
      <div className="shrink-0 group-hover:scale-105 transition-transform">
        <BrandLogo
          name={brandName}
          logoUrl={deal.brand?.logoUrl}
          website={deal.brand?.website}
          size="card"
        />
      </div>

      {/* Deal Information */}
      <div className="flex-1 min-w-0">
        {/* Header Row: Brand Name + Badges + Discount Value */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
              {brandName}
            </span>

            {deal.isStartupDeal && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60 shadow-2xs">
                <svg className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Startup</span>
              </span>
            )}

            {!deal.needsCreditCard && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 shadow-2xs">
                <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>No CC</span>
              </span>
            )}

            {deal.isStudentDeal && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60 shadow-2xs">
                <svg className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
                </svg>
                <span>Student</span>
              </span>
            )}

            {deal.isTrending && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 border border-amber-500/25 dark:bg-amber-950/40 dark:text-amber-300 shadow-2xs">
                <span>Trending</span>
                <svg className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
            )}

            {deal.isLimitedTime && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 shadow-2xs">
                <svg className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Limited</span>
              </span>
            )}
          </div>

          {deal.discountAmount && (
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/90 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60 px-2.5 py-0.5 rounded-md shrink-0">
              {deal.discountAmount}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors line-clamp-1 leading-snug">
          {displayTitle}
        </h3>
      </div>
    </Link>
  );
}
