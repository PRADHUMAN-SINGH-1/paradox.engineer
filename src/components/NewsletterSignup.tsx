'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Subscribed to developer perks digest.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Unable to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="developer@domain.com"
          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-indigo-500/60 text-xs font-mono focus:outline-none transition"
          required
          disabled={status === 'loading' || status === 'success'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-bold text-xs transition shrink-0 cursor-pointer disabled:opacity-50 font-sans shadow-xs"
        >
          {status === 'loading' ? '...' : status === 'success' ? 'Joined' : 'Subscribe'}
        </button>
      </form>

      {status === 'success' && (
        <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] mt-2">{message}</p>
      )}
      {status === 'error' && (
        <p className="text-rose-600 dark:text-rose-400 font-mono text-[11px] mt-2">{message}</p>
      )}
    </div>
  );
}
