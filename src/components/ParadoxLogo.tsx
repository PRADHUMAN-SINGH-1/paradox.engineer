'use client';

import React from 'react';
import Link from 'next/link';

interface ParadoxLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  href?: string;
  tag?: string;
}

export default function ParadoxLogo({
  size = 'md',
  showWordmark = true,
  className = '',
  href,
  tag = '',
}: ParadoxLogoProps) {
  const sizeMap = {
    sm: {
      icon: 'w-7 h-7',
      text: 'text-[15px] tracking-tight',
      badge: 'text-[9.5px] px-1.5 py-0.5',
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-[17px] tracking-tight',
      badge: 'text-[10.5px] px-2 py-0.5',
    },
    lg: {
      icon: 'w-10 h-10',
      text: 'text-xl tracking-tight',
      badge: 'text-xs px-2.5 py-0.5',
    },
    xl: {
      icon: 'w-12 h-12',
      text: 'text-2xl tracking-tight',
      badge: 'text-xs px-3 py-1',
    },
  };

  const { icon, text, badge } = sizeMap[size];

  const logoMark = (
    <div
      className={`relative ${icon} shrink-0 rounded-[10px] bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-[0_2px_8px_rgba(79,70,229,0.28)] group-hover:scale-105 transition-transform duration-200 select-none overflow-hidden flex items-center justify-center`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="pdx-logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#4338CA" />
          </linearGradient>
        </defs>

        {/* 1. Base Squircle Badge */}
        <rect width="40" height="40" rx="10" fill="url(#pdx-logo-grad)" />

        {/* 2. Top Specular Border Light */}
        <rect
          x="0.75"
          y="0.75"
          width="38.5"
          height="38.5"
          rx="9.25"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="1"
          fill="none"
        />

        {/* 3. Pure Modernist Geometric Ribbon 'P' */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11 9C11 8.44772 11.4477 8 12 8H24C28.4183 8 32 11.5817 32 16C32 20.4183 28.4183 24 24 24H21V19H23.5C25.1569 19 26.5 17.6569 26.5 16C26.5 14.3431 25.1569 13 23.5 13H16.5V31C16.5 31.5523 16.0523 32 15.5 32H12C11.4477 32 11 31.5523 11 31V9ZM21 24V28L16.5 32V24H21Z"
          fill="#FFFFFF"
        />

        {/* 4. Optical Interlocking Underfold Shadow */}
        <path d="M16.5 19H21V24H16.5V19Z" fill="#312E81" />
      </svg>
    </div>
  );

  const content = (
    <div className={`flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      {logoMark}

      {showWordmark && (
        <div className="flex items-center gap-1.5 sm:gap-2 leading-none select-none whitespace-nowrap shrink-0">
          <span className={`font-bold ${text} text-slate-900 dark:text-zinc-50 font-sans`}>
            Paradox
          </span>

          {tag && (
            <span
              className={`font-mono ${badge} font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 rounded-md tracking-tight transition-colors group-hover:border-indigo-500/40`}
            >
              {tag}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg whitespace-nowrap shrink-0"
      >
        {content}
      </Link>
    );
  }

  return content;
}
