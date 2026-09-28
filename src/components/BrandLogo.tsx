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
  'digitalocean': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/60' },
  'vultr': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/60' },
  'google-cloud': { bg: 'bg-amber-50 dark:bg-zinc-800', text: 'text-blue-600 dark:text-blue-400', border: 'border-amber-200 dark:border-zinc-700' },
};

// Known domain mappings for reliable logo resolution
const KNOWN_DOMAINS: Record<string, string> = {
  'digitalocean': 'digitalocean.com',
  'vultr': 'vultr.com',
  'aws': 'aws.amazon.com',
  'amazon web services': 'aws.amazon.com',
  'google cloud': 'cloud.google.com',
  'google cloud platform': 'cloud.google.com',
  'openai': 'openai.com',
  'anthropic': 'anthropic.com',
  'github': 'github.com',
  'supabase': 'supabase.com',
  'vercel': 'vercel.com',
  'cloudflare': 'cloudflare.com',
  'stripe': 'stripe.com',
  'cursor': 'cursor.com',
  'deepseek': 'deepseek.com',
  'perplexity': 'perplexity.ai',
  'perplexity ai': 'perplexity.ai',
  'postman': 'postman.com',
  'mongodb': 'mongodb.com',
  'sentry': 'sentry.io',
  'jetbrains': 'jetbrains.com',
  'docker': 'docker.com',
  'render': 'render.com',
  'railway': 'railway.app',
  'neon': 'neon.tech',
  'resend': 'resend.com',
  'notion': 'notion.so',
  'figma': 'figma.com',
  'linear': 'linear.app',
  'replit': 'replit.com',
  'hugging face': 'huggingface.co',
};

function extractHostname(url?: string | null, brandName?: string): string {
  if (brandName) {
    const key = brandName.toLowerCase().trim();
    if (KNOWN_DOMAINS[key]) return KNOWN_DOMAINS[key];
  }
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

export default function BrandLogo({
  name,
  logoUrl,
  website,
  size = 'md',
  className = '',
}: BrandLogoProps) {
  const [triedFallback, setTriedFallback] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const brandKey = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const domain = extractHostname(website, name);

  // 1. Direct logoUrl (if provided)
  // 2. High-res Google S2 favicon CDN (128px)
  // 3. DuckDuckGo icon fallback
  const primarySrc = logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null);
  const fallbackSrc = domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : null;

  const currentSrc = !triedFallback ? primarySrc : fallbackSrc;

  const handleError = () => {
    if (!triedFallback && fallbackSrc && fallbackSrc !== primarySrc) {
      setTriedFallback(true);
    } else {
      setImgFailed(true);
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg text-xs',
    md: 'w-9 h-9 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-xl text-base',
    card: 'w-14 h-14 rounded-2xl text-lg',
    xl: 'w-16 h-16 rounded-2xl text-xl',
  }[size];

  const imgSize = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5.5 h-5.5',
    lg: 'w-7 h-7',
    card: 'w-8 h-8',
    xl: 'w-10 h-10',
  }[size];

  const brandColor = BRAND_COLORS[brandKey] || {
    bg: 'bg-blue-50 dark:bg-zinc-800',
    text: 'text-blue-700 dark:text-zinc-200',
    border: 'border-blue-200 dark:border-zinc-700',
  };

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/80 shadow-2xs overflow-hidden ${sizeClasses} ${className}`}
      title={name}
    >
      {!imgFailed && currentSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt={`${name} logo`}
          className={`${imgSize} object-contain transition-transform group-hover:scale-105 duration-200 rounded-xs`}
          loading="lazy"
          onError={handleError}
        />
      ) : (
        <span className={`font-mono font-bold ${brandColor.text}`}>
          {initial}
        </span>
      )}
    </div>
  );
}
