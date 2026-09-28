import DealCard from './DealCard';

interface DealGridProps {
  deals: any[];
}

export default function DealGrid({ deals }: DealGridProps) {
  if (!deals || deals.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900/40 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8 shadow-xs">
        <span className="text-3xl mb-3">🔍</span>
        <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-200 mb-1">No matching offers found</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
          We could not find any active verified perks matching this filter. Try adjusting your search or checking another category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {deals.map((deal, index) => (
        <DealCard key={deal.slug || index} deal={deal} />
      ))}
    </div>
  );
}
