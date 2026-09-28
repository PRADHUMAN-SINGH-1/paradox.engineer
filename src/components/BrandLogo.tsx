'use client';

import { useState } from 'react';

interface BrandLogoProps {
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'card';
  className?: string;
}

// Brand specific color tints for fallback monograms
const BRAND_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'anthropic': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/60' },
  'openai': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/60' },
  'github': { bg: 'bg-slate-100 dark:bg-zinc-800', text: 'text-slate-900 dark:text-white', border: 'border-slate-300 dark:border-zinc-700' },
  'supabase': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/60' },
  'vercel': { bg: 'bg-slate-900 dark:bg-white', text: 'text-white dark:text-zinc-950', border: 'border-slate-800 dark:border-white' },
  'cursor': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800/60' },
  'aws': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/60' },
  'deepseek': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800/60' },
  'perplexity-ai': { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800/60' },
};

export default function BrandLogo({
  name,
  logoUrl,
  website,
  size = 'md',
  className = '',
}: BrandLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const brandKey = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // Use only first-party stored logos. Avoid remote favicon requests on every card/page.
  const primarySrc = logoUrl || null;

  const sizeClasses = {
    sm: 'w-6 h-6 rounded-md text-[10px]',
    md: 'w-9 h-9 rounded-lg text-xs',
    lg: 'w-12 h-12 rounded-xl text-base',
    card: 'w-14 h-14 rounded-2xl text-lg',
    xl: 'w-16 h-16 rounded-2xl text-xl',
  }[size];

  const imgSize = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    card: 'w-9 h-9',
    xl: 'w-10 h-10',
  }[size];

  const brandColor = BRAND_COLORS[brandKey] || {
    bg: 'bg-blue-50 dark:bg-zinc-800',
    text: 'text-blue-700 dark:text-zinc-200',
    border: 'border-blue-200 dark:border-zinc-700',
  };

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs overflow-hidden ${sizeClasses} ${className}`}
      title={name}
    >
      {!imgFailed && primarySrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={primarySrc}
          alt={`${name} logo`}
          className={`${imgSize} object-contain transition-transform group-hover:scale-110 duration-200`}
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className={`font-mono font-bold ${brandColor.text}`}>
          {initial}
        </span>
      )}
    </div>
  );
}
