interface ExpiryBadgeProps {
  expiryDate?: Date | string | null;
  isLimitedTime?: boolean;
  className?: string;
  showExactTime?: boolean;
}

export default function ExpiryBadge({
  expiryDate,
  isLimitedTime,
  className = '',
  showExactTime = false,
}: ExpiryBadgeProps) {
  if (!expiryDate) {
    if (isLimitedTime) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 ${className}`}
          title="This is a limited-time developer offer that may expire soon"
        >
          <svg className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Limited Time</span>
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        <span>Active</span>
      </span>
    );
  }

  const exp = new Date(expiryDate);
  const now = new Date();
  const diffMs = exp.getTime() - now.getTime();
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const shortDate = exp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const fullDate = exp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeFormatted = exp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const fullTitle = `Last date to claim: ${fullDate} at ${timeFormatted}`;

  // 1. Offer has ended
  if (diffMs <= 0) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 ${className}`}
        title={`Expired on ${fullDate}`}
      >
        <span>Ended ({shortDate})</span>
      </span>
    );
  }

  // 2. Urgent: Expiring in less than 24 hours (Today!)
  if (diffHours <= 24) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 animate-pulse ${className}`}
        title={fullTitle}
      >
        <svg className="w-3 h-3 shrink-0 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Ends in {diffHours}h {showExactTime ? `(${timeFormatted})` : '• Today'}</span>
      </span>
    );
  }

  // 3. High Priority Warning: Expiring in 1 to 3 days
  if (diffDays <= 3) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/35 shadow-2xs ${className}`}
        title={fullTitle}
      >
        <svg className="w-3 h-3 shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Ends in {diffDays}d • {shortDate}</span>
      </span>
    );
  }

  // 4. Closing soon: Expiring in 4 to 7 days
  if (diffDays <= 7) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 ${className}`}
        title={fullTitle}
      >
        <svg className="w-3 h-3 shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Ends in {diffDays} days ({shortDate})</span>
      </span>
    );
  }

  // 5. Future expiry (over 7 days away)
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-zinc-800/90 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 ${className}`}
      title={fullTitle}
    >
      <svg className="w-3 h-3 shrink-0 text-slate-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>Valid until {shortDate}</span>
    </span>
  );
}
