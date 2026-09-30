import Link from 'next/link';
import BrandLogo from './BrandLogo';

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  website?: string | null;
  _count?: {
    deals: number;
  };
}

interface PopularBrandsProps {
  brands: BrandItem[];
}

export default function PopularBrands({ brands }: PopularBrandsProps) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">✨</span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Popular brands
          </h2>
        </div>
        <Link
          href="/brands"
          className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition flex items-center gap-1"
        >
          <span>Show all brand deals</span>
          <span>&rarr;</span>
        </Link>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:hover:border-zinc-700 transition shrink-0 shadow-2xs group"
          >
            <BrandLogo
              name={brand.name}
              logoUrl={brand.logoUrl}
              website={brand.website}
              size="sm"
            />
            <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-white transition whitespace-nowrap">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
