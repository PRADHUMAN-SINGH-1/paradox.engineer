interface ExpiryBadgeProps {
  expiryDate?: Date | string | null;
  isLimitedTime?: boolean;
  className?: string;
}

export default function ExpiryBadge({ expiryDate, isLimitedTime, className = '' }: ExpiryBadgeProps) {
  if (!expiryDate) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
        <span>Verified Active</span>
      </span>
    );
  }

  const exp = new Date(expiryDate);
  const now = new Date();
  const diffMs = exp.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 ${className}`}>
        <span>Ended</span>
      </span>
    );
  }

  if (diffDays <= 7) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/80 ${className}`}>
        <span>⏱️</span>
        <span>Ends in {diffDays} {diffDays === 1 ? 'day' : 'days'}</span>
      </span>
    );
  }

  const formatted = exp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60 ${className}`}>
      <span>⏱️</span>
      <span>Valid until {formatted}</span>
    </span>
  );
}
