'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

const PANEL_LINKS = [
  {
    href: '/startups',
    icon: (
      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: 'Developer Perks',
    description: 'Free tools & startup resources',
  },
  {
    href: '/category/credits',
    icon: (
      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    label: 'Cloud Credits',
    description: 'AWS, GCP, Azure & more',
  },
  {
    href: '/student',
    icon: (
      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
      </svg>
    ),
    label: 'Student Offers',
    description: 'Exclusive .edu discounts',
  },
  {
    href: '/latest',
    icon: (
      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Latest Deals',
    description: 'Freshly added savings',
  },
];

export default function RobotAssistant() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [msgIdx, setMsgIdx] = useState(0);

  const slimeRef = useRef<HTMLDivElement>(null);

  // Creative rotating messages emphasizing creator & perks
  const messages: React.ReactNode[] = [
    (
      <span key="dev-pitch-1">
        🤖 &ldquo;I didn&apos;t code myself! My creator works tirelessly on this — check his{' '}
        <a
          href="https://www.linkedin.com/in/pradhuman--singh/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center font-extrabold text-amber-300 hover:text-white underline decoration-wavy underline-offset-2 transition-all hover:scale-105"
        >
          LinkedIn ↗
        </a>
        &rdquo;
      </span>
    ),
    '✨ Psst! Free cloud credits are waiting for you!',
    (
      <span key="dev-pitch-2">
        ☕ &ldquo;Built with coffee & late-night commits by Pradhuman Singh! Say hi on{' '}
        <a
          href="https://www.linkedin.com/in/pradhuman--singh/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center font-extrabold text-amber-300 hover:text-white underline decoration-wavy underline-offset-2 transition-all hover:scale-105"
        >
          LinkedIn ↗
        </a>
        &rdquo;
      </span>
    ),
    '💖 Need free dev tools? Tap me to browse curated grants!',
    '🎓 Are you a student? Huge .edu savings inside!',
    '⭐ New verified deals just landed today!',
  ];

  // Rotate messages every 6.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Periodic cute natural blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Pupil eye tracking relative to bottom-right position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!slimeRef.current) return;
      const rect = slimeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.hypot(deltaX, deltaY);
      const maxOffset = 5;

      if (dist === 0) {
        setPupilPos({ x: 0, y: 0 });
      } else {
        const factor = Math.min(dist / 220, 1) * maxOffset;
        setPupilPos({
          x: (deltaX / dist) * factor,
          y: (deltaY / dist) * factor,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = useCallback(() => {
    setPanelOpen((v) => !v);
  }, []);

  return (
    <>
      {/* Anchored Floating Mascot in Bottom-Right Corner - Elevated so footer links are never covered */}
      <div className="fixed bottom-14 right-4 sm:bottom-16 sm:right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-auto select-none">
        {/* Speech bubble — shown when panel is closed */}
        {!panelOpen && (
          <div
            className="
              max-w-[240px] sm:max-w-[290px]
              rounded-2xl rounded-br-sm
              bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600
              text-white text-xs sm:text-sm font-medium
              px-3.5 py-2.5
              shadow-xl shadow-indigo-500/35
              animate-bubble-float
              cursor-pointer
              transition-transform hover:scale-105 active:scale-95
              border border-white/15
            "
            onClick={handleClick}
          >
            {messages[msgIdx]}
          </div>
        )}

        {/* Quick-links panel — shown when open */}
        {panelOpen && (
          <div
            className="
              w-68 sm:w-76
              rounded-2xl
              bg-white dark:bg-zinc-900
              border border-slate-200 dark:border-zinc-800
              shadow-2xl shadow-indigo-500/25
              overflow-hidden
              animate-panel-pop
            "
          >
            {/* Panel header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-4 py-3 flex items-center justify-between">
              <span className="text-white font-bold text-sm flex items-center gap-1.5">
                <span>✨</span> Quick Perks & Deals
              </span>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-indigo-100 hover:text-white transition-colors text-xl leading-none w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10"
                aria-label="Close assistant panel"
              >
                ×
              </button>
            </div>

            {/* Links */}
            <div className="p-2 space-y-1">
              {PANEL_LINKS.map(({ href, icon, label, description }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setPanelOpen(false)}
                  className="
                    flex items-center gap-3
                    px-3 py-2.5
                    rounded-xl
                    hover:bg-indigo-50 dark:hover:bg-indigo-950/40
                    transition-all group
                  "
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-950 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 truncate font-medium">
                      {description}
                    </p>
                  </div>
                </Link>
              ))}

              {/* Special Animated LinkedIn Creator Card */}
              <a
                href="https://www.linkedin.com/in/pradhuman--singh/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setPanelOpen(false)}
                className="
                  flex items-center gap-3
                  px-3 py-2.5
                  rounded-xl
                  bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/30
                  hover:from-indigo-100 hover:to-violet-100 dark:hover:from-indigo-900/60 dark:hover:to-violet-900/50
                  border border-indigo-200 dark:border-indigo-800/60
                  transition-all group shadow-2xs
                "
              >
                <div className="w-8 h-8 rounded-lg bg-[#0077b5]/10 dark:bg-[#0077b5]/20 border border-[#0077b5]/30 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <svg className="w-4 h-4 fill-[#0077b5] dark:fill-[#38bdf8]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                    Connect with Creator
                    <span className="text-xs transition-transform group-hover:translate-x-0.5">↗</span>
                  </p>
                  <p className="text-xs text-indigo-950/70 dark:text-indigo-200/70 truncate font-medium">
                    Pradhuman Singh on LinkedIn
                  </p>
                </div>
              </a>
            </div>

            <div className="px-4 pb-3 pt-1 text-center border-t border-slate-100 dark:border-zinc-800/80 mt-1">
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold">
                paradox.engineer • curated for builders
              </p>
            </div>
          </div>
        )}

        {/* Cute Kawaii Slime Mascot — Gently levitating in place */}
        <div
          ref={slimeRef}
          onClick={handleClick}
          onMouseEnter={() => setIsHappy(true)}
          onMouseLeave={() => setIsHappy(false)}
          className="relative cursor-pointer select-none group"
          aria-label="Paradox assistant mascot"
        >
          {/* Ground soft shadow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-3 bg-indigo-950/25 dark:bg-black/60 rounded-full blur-[3px] slime-shadow" />

          {/* Slime Body with Jelly bounce */}
          <div className="slime-bounce relative w-[76px] h-[70px] filter drop-shadow(0 8px 18px rgba(99,102,241,0.45)) transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
            <svg
              viewBox="0 0 100 90"
              className="w-full h-full overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Slime body vibrant gradient */}
                <linearGradient id="slimeGrad" x1="15%" y1="0%" x2="85%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="45%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>

                {/* Inner jelly shine gradient */}
                <linearGradient id="innerGlow" x1="30%" y1="0%" x2="50%" y2="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                {/* Star gradient */}
                <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Slime Main Jelly Body */}
              <path
                d="M50 14 C26 14 10 32 10 54 C10 74 24 84 50 84 C76 84 90 74 90 54 C90 32 74 14 50 14 Z"
                fill="url(#slimeGrad)"
              />

              {/* Kawaii Tiny Little Head Sprout / Antenna with golden Star */}
              <g className="animate-star-wiggle" style={{ transformOrigin: '50px 14px' }}>
                <path d="M50 14 Q52 4 50 1" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
                {/* Cute Mini Sparkle Star on Head */}
                <polygon
                  points="50,-4 52,0 56,1 52,3 50,7 48,3 44,1 48,0"
                  fill="url(#starGrad)"
                  filter="drop-shadow(0 0 4px rgba(250, 204, 21, 0.8))"
                />
              </g>

              {/* Top highlight shine (Jelly 3D reflection) */}
              <ellipse cx="36" cy="30" rx="14" ry="7" fill="url(#innerGlow)" transform="rotate(-25 36 30)" />
              <circle cx="25" cy="40" r="2.5" fill="#ffffff" fillOpacity="0.6" />

              {/* Cute Pink Cheeks (Blush) */}
              <ellipse cx="25" cy="58" rx="6" ry="3.5" fill="#f43f5e" fillOpacity="0.45" />
              <ellipse cx="75" cy="58" rx="6" ry="3.5" fill="#f43f5e" fillOpacity="0.45" />

              {/* EYES */}
              {isBlinking ? (
                // Blinking cute curved lines ^ ^
                <g stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none">
                  <path d="M30 52 Q37 47 44 52" />
                  <path d="M56 52 Q63 47 70 52" />
                </g>
              ) : isHappy ? (
                // Happy curved anime eyes ^ ^
                <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none">
                  <path d="M29 53 Q37 45 45 53" />
                  <path d="M55 53 Q63 45 71 53" />
                </g>
              ) : (
                // Big Kawaii Sparkle Eyes with Cursor Tracking
                <g>
                  {/* Left Eye */}
                  <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
                    <ellipse cx="37" cy="50" rx="6.5" ry="8.5" fill="#0f172a" />
                    {/* Big white main sparkle */}
                    <circle cx="35" cy="47" r="3.2" fill="#ffffff" />
                    {/* Small sub-sparkle */}
                    <circle cx="39" cy="53" r="1.5" fill="#ffffff" />
                  </g>

                  {/* Right Eye */}
                  <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
                    <ellipse cx="63" cy="50" rx="6.5" ry="8.5" fill="#0f172a" />
                    {/* Big white main sparkle */}
                    <circle cx="61" cy="47" r="3.2" fill="#ffffff" />
                    {/* Small sub-sparkle */}
                    <circle cx="65" cy="53" r="1.5" fill="#ffffff" />
                  </g>
                </g>
              )}

              {/* MOUTH */}
              {isHappy ? (
                // Big joyful open mouth with tongue :D
                <g>
                  <path
                    d="M44 58 Q50 67 56 58 Z"
                    fill="#be123c"
                  />
                  <path
                    d="M47 62 Q50 66 53 62 Z"
                    fill="#fb7185"
                  />
                </g>
              ) : (
                // Cute little kitty smile :3
                <path
                  d="M44 58 Q50 61 56 58"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        /* Kawaii Bouncy Jelly Floating Physics */
        @keyframes slime-jelly-float {
          0%, 100% {
            transform: translateY(0) scale(1, 1);
          }
          30% {
            transform: translateY(-9px) scale(0.96, 1.04);
          }
          65% {
            transform: translateY(-13px) scale(1.03, 0.97);
          }
          85% {
            transform: translateY(-2px) scale(1.05, 0.95);
          }
        }

        .slime-bounce {
          animation: slime-jelly-float 3.4s ease-in-out infinite;
          transform-origin: bottom center;
        }

        @keyframes slime-shadow-pulse {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 0.55;
          }
          50% {
            transform: translate(-50%, 0) scale(0.75);
            opacity: 0.25;
          }
        }

        .slime-shadow {
          animation: slime-shadow-pulse 3.4s ease-in-out infinite;
        }

        @keyframes star-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }

        .animate-star-wiggle {
          animation: star-wiggle 2.8s ease-in-out infinite;
        }

        @keyframes bubble-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-bubble-float {
          animation: bubble-float 2.6s ease-in-out infinite;
        }

        @keyframes panel-pop {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-panel-pop {
          animation: panel-pop 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}
