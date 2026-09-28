'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitDealPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      brandName: formData.get('brandName'),
      dealTitle: formData.get('dealTitle'),
      dealUrl: formData.get('dealUrl'),
      description: formData.get('description'),
      submittedBy: formData.get('submittedBy'),
    };

    try {
      const res = await fetch('/api/submit-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-sans">
        <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-xl font-bold">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Perk Submitted Successfully!</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Thank you for contributing. Our editorial team will review the link, verify the promo code, and publish it live to the Paradox directory.
          </p>
          <div className="pt-4 flex justify-center gap-3 text-xs font-semibold">
            <button 
              type="button"
              onClick={() => setStatus('idle')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-xl transition cursor-pointer"
            >
              Submit Another Deal
            </button>
            <Link 
              href="/"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-xs"
            >
              Browse All Deals &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:py-16 space-y-6 font-sans">
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
          Submit a Deal or Perk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Know of a great software discount, cloud compute grant, or student perk? Share it with the developer community.
        </p>
      </div>

      {status === 'error' && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 text-xs">
          Failed to submit deal. Please check that all required fields are filled out and try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 text-xs shadow-xs">
        <div>
          <label htmlFor="brandName" className="block text-xs font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">
            Brand or Company Name *
          </label>
          <input 
            required 
            type="text" 
            id="brandName" 
            name="brandName" 
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-900 outline-none text-xs transition" 
            placeholder="e.g. Supabase, Anthropic, Vultr" 
          />
        </div>

        <div>
          <label htmlFor="dealTitle" className="block text-xs font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">
            Deal Title *
          </label>
          <input 
            required 
            type="text" 
            id="dealTitle" 
            name="dealTitle" 
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-900 outline-none text-xs transition" 
            placeholder="e.g. $100 Free Cloud Credits for Startups" 
          />
        </div>

        <div>
          <label htmlFor="dealUrl" className="block text-xs font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">
            Direct Offer or Claim URL *
          </label>
          <input 
            required 
            type="url" 
            id="dealUrl" 
            name="dealUrl" 
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-900 outline-none text-xs transition" 
            placeholder="https://example.com/promo-claim" 
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">
            Offer Description & Eligibility Details
          </label>
          <textarea 
            id="description" 
            name="description" 
            rows={3} 
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-900 outline-none text-xs transition" 
            placeholder="Explain what the perk includes, promo codes needed, and who qualifies." 
          />
        </div>

        <div>
          <label htmlFor="submittedBy" className="block text-xs font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">
            Your Email (for notification when published)
          </label>
          <input 
            type="email" 
            id="submittedBy" 
            name="submittedBy" 
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-900 outline-none text-xs transition" 
            placeholder="you@domain.com" 
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition disabled:opacity-50 shadow-xs cursor-pointer"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Deal for Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
