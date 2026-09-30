import { HTMLAttributes } from 'react';

export type BadgeType = 'trending' | 'limited' | 'student' | 'startup' | 'nocc';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  type: BadgeType;
}

export default function Badge({ type, className = '', ...props }: BadgeProps) {
  const config = {
    trending: { 
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/80', 
      label: 'TRENDING' 
    },
    limited: { 
      bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/80', 
      label: 'EXPIRING_SOON' 
    },
    student: { 
      bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/80', 
      label: 'EDU' 
    },
    startup: { 
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/80', 
      label: 'STARTUP' 
    },
    nocc: { 
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/80', 
      label: 'NO_CC' 
    },
  };

  const { bg, label } = config[type];

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${bg} ${className}`}
      title={label}
      {...props}
    >
      {label}
    </span>
  );
}
