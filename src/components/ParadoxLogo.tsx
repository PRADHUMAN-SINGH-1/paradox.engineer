import React from 'react';
import Link from 'next/link';

interface ParadoxLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  href?: string;
}

export default function ParadoxLogo({
  size = 'md',
  showWordmark = true,
  className = '',
  href,
}: ParadoxLogoProps) {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-sm', badge: 'text-[10px]' },
    md: { icon: 'w-8 h-8', text: 'text-base', badge: 'text-[11px]' },
    lg: { icon: 'w-10 h-10', text: 'text-xl', badge: 'text-xs' },
    xl: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'text-sm' },
  };

  const { icon, text, badge } = sizeMap[size];

  const logoMark = (
    <div className={`relative ${icon} shrink-0 group-hover:scale-105 transition-transform duration-200`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(37,99,235,0.25)]"
      >
        <defs>
          <linearGradient id="paradox-blue-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="paradox-blue-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="paradox-blue-3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Impossible Ribbon 'P' Logo Mark */}
        {/* Background rounded squircle container */}
        <rect width="40" height="40" rx="11" className="fill-blue-600 dark:fill-blue-500/10" />

        {/* Geometric Impossible Loop Facet 1: Left Vertical Pillar */}
        <path
          d="M11 9H17V31H11V9Z"
          fill="url(#paradox-blue-2)"
          className="dark:opacity-90"
        />

        {/* Geometric Facet 2: Upper Arch loop */}
        <path
          d="M17 9H25C28.3137 9 31 11.6863 31 15C31 18.3137 28.3137 21 25 21H17V15H25C25 15 25 15 25 15C25 15 25 15 25 15H17V9Z"
          fill="white"
          opacity="0.95"
        />

        {/* Geometric Facet 3: Impossible Interlocking Fold */}
        <path
          d="M17 15H23C24.1046 15 25 15.8954 25 17C25 18.1046 24.1046 19 23 19H17V27H11V21H17V15Z"
          fill="url(#paradox-blue-3)"
        />

        {/* Center Quantum Void / Negative Space Sparkle */}
        <circle cx="21" cy="15" r="2.2" fill="white" />
      </svg>
    </div>
  );

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {logoMark}

      {showWordmark && (
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className={`font-extrabold ${text} tracking-tight text-slate-900 dark:text-white font-sans`}>
            Paradox
          </span>
          <span className={`font-semibold ${badge} text-blue-600 dark:text-blue-400 font-sans tracking-normal`}>
            deal
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
