'use client';

import React from 'react';
import type { AdminToastState } from '@/lib/admin/types';

interface AdminToastProps {
  toast: AdminToastState | null;
  onClose: () => void;
}

export default function AdminToast({ toast, onClose }: AdminToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 text-xs animate-in fade-in slide-in-from-bottom-3 duration-200 font-sans">
      <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
      <span className="font-semibold">{toast.text}</span>
      {toast.actionLabel && toast.onAction && (
        <button
          type="button"
          onClick={toast.onAction}
          className="ml-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm cursor-pointer whitespace-nowrap"
        >
          {toast.actionLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer p-1"
        title="Dismiss toast"
      >
        ✕
      </button>
    </div>
  );
}
