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
  'mistral-ai': { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800/60' },
  'mistral': { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800/60' },
};

// Comprehensive domain mappings for 150+ catalog brands
const KNOWN_DOMAINS: Record<string, string> = {
  // Mistral & Frontier AI
  'mistral': 'mistral.ai',
  'mistral ai': 'mistral.ai',
  'mistralai': 'mistral.ai',
  'openai': 'openai.com',
  'anthropic': 'anthropic.com',
  'deepseek': 'deepseek.com',
  'perplexity': 'perplexity.ai',
  'perplexity ai': 'perplexity.ai',
  'xai': 'x.ai',
  'google gemini': 'gemini.google.com',
  'meta platforms, inc.': 'meta.com',
  'meta': 'meta.com',
  'cursor': 'cursor.com',
  'elevenlabs': 'elevenlabs.io',
  'minimax': 'minimaxi.com',
  'merlin ai': 'getmerlin.in',
  'wispr ai inc': 'flowvoice.ai',
  'browser use inc.': 'browser-use.com',
  'manus ai': 'manus.im',
  'bolt.new': 'bolt.new',
  'openart': 'openart.ai',
  'meshy ai': 'meshy.ai',
  'blink.new': 'blink.new',
  'modal': 'modal.com',
  'krea.ai, inc.': 'krea.ai',
  'krea.ai': 'krea.ai',
  'krea': 'krea.ai',
  'base44': 'base44.com',
  'notegpt inc.': 'notegpt.io',
  'runwayml': 'runwayml.com',
  'suno': 'suno.com',
  'circleco, inc.': 'circle.so',
  'you.com': 'you.com',
  'trae': 'trae.ai',
  'wasmer pro': 'wasmer.io',
  'wasmer': 'wasmer.io',
  'gearup booster': 'gearupbooster.com',
  'heygen': 'heygen.com',
  'parallel ai': 'parallel.ai',
  'granola': 'granola.so',
  'kimi': 'moonshot.cn',
  'vidu ai': 'vidu.studio',
  'jasper ai': 'jasper.ai',
  'deepgram': 'deepgram.com',
  'coderabbit': 'coderabbit.ai',
  'seaart ai': 'seaart.ai',
  'morphic, inc.': 'morphic.sh',
  'otter.ai': 'otter.ai',
  'scite.ai': 'scite.ai',
  'oxlo.ai': 'oxlo.ai',
  'hyper3d': 'hyper3d.ai',
  'writesonic': 'writesonic.com',
  'consensus': 'consensus.app',
  'udio (uncharted labs)': 'udio.com',
  'udio': 'udio.com',
  'murf ai': 'murf.ai',
  'reclaim.ai': 'reclaim.ai',
  'higgsfield ai': 'higgsfield.ai',
  'pixverse ai': 'pixverse.ai',
  'kiro': 'kiro.ai',
  'agentrouter': 'agentrouter.com',
  'qoder': 'qoder.io',

  // Cloud & Infrastructure
  'digitalocean': 'digitalocean.com',
  'vultr': 'vultr.com',
  'aws': 'aws.amazon.com',
  'amazon': 'amazon.com',
  'amazon web services': 'aws.amazon.com',
  'google cloud': 'cloud.google.com',
  'google cloud platform': 'cloud.google.com',
  'google': 'google.com',
  'google workspace': 'workspace.google.com',
  'google antigravity': 'google.com',
  'microsoft': 'microsoft.com',
  'microsoft corporation': 'microsoft.com',
  'microsoft azure': 'azure.microsoft.com',
  'oracle corporation': 'oracle.com',
  'oracle': 'oracle.com',
  'cloudflare': 'cloudflare.com',
  'cloudflare, inc.': 'cloudflare.com',
  'civo': 'civo.com',
  'cloudways': 'cloudways.com',
  'upcloud': 'upcloud.com',
  'ovhcloud': 'ovhcloud.com',
  'tencent cloud': 'tencentcloud.com',
  'alibaba cloud': 'alibabacloud.com',
  'akamai': 'akamai.com',
  'ibm': 'ibm.com',
  'render': 'render.com',
  'railway': 'railway.app',
  'neon': 'neon.tech',
  'resend': 'resend.com',
  'docker': 'docker.com',
  'hashicorp': 'hashicorp.com',
  'netlify': 'netlify.com',
  'heroku': 'heroku.com',
  'databricks': 'databricks.com',
  'mongodb': 'mongodb.com',

  // Developer Tools & Productivity
  'github': 'github.com',
  'supabase': 'supabase.com',
  'vercel': 'vercel.com',
  'stripe': 'stripe.com',
  'postman': 'postman.com',
  'sentry': 'sentry.io',
  'jetbrains': 'jetbrains.com',
  'notion': 'notion.so',
  'figma': 'figma.com',
  'linear': 'linear.app',
  'replit': 'replit.com',
  'hugging face': 'huggingface.co',
  'raycast': 'raycast.com',
  'zed.dev': 'zed.dev',
  'emergent.sh': 'emergent.sh',
  'craft.do': 'craft.do',
  'framer': 'framer.com',
  'airtable': 'airtable.com',
  'asana, inc.': 'asana.com',
  'atlassian': 'atlassian.com',
  'slack': 'slack.com',
  '1password': '1password.com',
  'overleaf': 'overleaf.com',
  'descript': 'descript.com',
  'sketch': 'sketch.com',
  'shapr3d': 'shapr3d.com',
  'autodesk': 'autodesk.com',
  'unity technologies': 'unity.com',
  '37signals llc': '37signals.com',
  'lucid software': 'lucid.co',
  'zoho': 'zoho.com',
  'jotform inc.': 'jotform.com',
  'pipedrive': 'pipedrive.com',
  'squarespace': 'squarespace.com',
  'softr': 'softr.io',
  'sync.com': 'sync.com',
  'pcloud': 'pcloud.com',
  'koofr': 'koofr.eu',
  'proton ag': 'proton.me',
  'mega limited': 'mega.io',

  // Other Popular Tech Brands
  'apple': 'apple.com',
  'youtube': 'youtube.com',
  'lovable': 'lovable.dev',
  'duolingo': 'duolingo.com',
  'discord': 'discord.com',
  'adobe': 'adobe.com',
  'spotify ab': 'spotify.com',
  'miro': 'miro.com',
  'shutterstock': 'shutterstock.com',
  'nordvpn': 'nordvpn.com',
  'canva': 'canva.com',
  'xiaomi': 'mi.com',
  'udemy': 'udemy.com',
  'spaceship, inc.': 'spaceship.com',
  'linkedin': 'linkedin.com',
  'preply, inc.': 'preply.com',
  'multcloud': 'multcloud.com',
  'kaggle': 'kaggle.com',
  'malwarebytes': 'malwarebytes.com',
  'namecheap': 'namecheap.com',
  'y combinator': 'ycombinator.com',
  'aerolink': 'aerolink.com',
  'grammarly': 'grammarly.com',
  'toggle vpn': 'togglevpn.com',
  'tableau': 'tableau.com',
  'godaddy': 'godaddy.com',
  'hostgator': 'hostgator.com',
  'coursera, inc.': 'coursera.org',
  'kit, inc': 'kit.co',
  'quillbot': 'quillbot.com',
  'grass.io': 'grass.io',
  'jio': 'jio.com',
  'veed': 'veed.io',
  'softorbits': 'softorbits.com',
  'lcn': 'lcn.com',
  'hulu / disney+': 'disneyplus.com',
  'paperpal': 'paperpal.com',
  'headspace': 'headspace.com',
};

function extractHostname(url?: string | null, brandName?: string): string {
  if (brandName) {
    const rawKey = brandName.toLowerCase().trim();
    if (KNOWN_DOMAINS[rawKey]) return KNOWN_DOMAINS[rawKey];

    // Strip corporate legal suffixes and recheck
    const cleanedKey = rawKey
      .replace(/,\s*(inc\.|inc|llc|ab|ltd|limited|corp|corporation|ag)$/i, '')
      .replace(/\s+(inc\.|inc|llc|ab|ltd|limited|corp|corporation|ag)$/i, '')
      .trim();
    if (KNOWN_DOMAINS[cleanedKey]) return KNOWN_DOMAINS[cleanedKey];

    // If brand name already contains a dot with a recognized TLD
    if (/\.(ai|io|dev|sh|co|so|app|tech|com|org|net|me|is|to|studio|new)$/i.test(cleanedKey)) {
      return cleanedKey.replace(/[^a-z0-9.-]/g, '');
    }
  }

  if (!url) {
    if (brandName) {
      // Heuristic fallback: brandname.com
      const slug = brandName
        .toLowerCase()
        .replace(/,\s*(inc\.|inc|llc|ab|ltd|limited|corp|corporation|ag)$/i, '')
        .replace(/[^a-z0-9]/g, '');
      if (slug && slug.length > 2) return `${slug}.com`;
    }
    return '';
  }

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
    sm: 'w-8 h-8 rounded-lg text-xs p-1',
    md: 'w-10 h-10 rounded-xl text-sm p-1.5',
    lg: 'w-12 h-12 rounded-xl text-base p-2',
    card: 'w-14 h-14 rounded-2xl text-lg p-2',
    xl: 'w-16 h-16 rounded-2xl text-xl p-2.5',
  }[size];

  const brandColor = BRAND_COLORS[brandKey] || {
    bg: 'bg-slate-100 dark:bg-zinc-800',
    text: 'text-slate-900 dark:text-zinc-100',
    border: 'border-slate-200 dark:border-zinc-750',
  };

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center bg-white dark:bg-zinc-850 border border-slate-200/90 dark:border-zinc-700/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden ${sizeClasses} ${className}`}
      title={name}
    >
      {!imgFailed && currentSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt={`${name} logo`}
          className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-200 rounded-xs"
          loading="lazy"
          onError={handleError}
        />
      ) : (
        <span className={`font-mono font-extrabold ${brandColor.text}`}>
          {initial}
        </span>
      )}
    </div>
  );
}
