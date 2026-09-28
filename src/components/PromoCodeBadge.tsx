'use client';

import { useState } from 'react';

interface PromoCodeBadgeProps {
  code: string;
}

export default function PromoCodeBadge({ code }: PromoCodeBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy promo code"
      className="relative z-10 group/code font-mono text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-dashed border-slate-300 dark:text-zinc-300 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:border-zinc-600 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer"
    >
      <span className="text-slate-400 dark:text-zinc-500 text-[10px]">
        {copied ? 'COPIED!' : 'CODE:'}
      </span>
      <span className="text-slate-900 dark:text-white font-bold group-hover/code:text-blue-600 dark:group-hover/code:text-blue-400">
        {code}
      </span>
      <span className="text-[10px] ml-0.5 opacity-60 group-hover/code:opacity-100">
        {copied ? '✓' : '📋'}
      </span>
    </button>
  );
}
