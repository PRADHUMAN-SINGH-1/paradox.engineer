'use client';

import React from 'react';
import type { SubmissionItem } from '@/lib/admin/types';

interface PendingSubmissionsProps {
  submissions: SubmissionItem[];
  onApprove: (submissionId: string) => void;
}

export default function PendingSubmissions({
  submissions,
  onApprove,
}: PendingSubmissionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        Community Submitted Deals
      </h3>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8">
          <p className="text-3xl mb-2">🎉</p>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
            No pending submissions
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            All community perks have been reviewed and published.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {sub.brandName}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {sub.dealTitle}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-zinc-400">{sub.description}</p>

              <div className="text-xs">
                <span className="text-slate-400">Target URL: </span>
                <a
                  href={sub.dealUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-mono text-[11px] truncate inline-block max-w-xs"
                >
                  {sub.dealUrl} ↗
                </a>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(sub.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  ✓ Approve & Publish Live
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
