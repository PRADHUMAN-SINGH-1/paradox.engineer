'use client';

import React from 'react';
import type { DealFormData } from '@/lib/admin/types';

interface DealFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'customize';
  title: string;
  formData: DealFormData;
  onChange: (data: DealFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  loading?: boolean;
}

export default function DealFormModal({
  isOpen,
  mode,
  title,
  formData,
  onChange,
  onSubmit,
  onClose,
  loading = false,
}: DealFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Deal Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => onChange({ ...formData, title: e.target.value })}
              placeholder="e.g. Vultr $250 Cloud Credits for New Users"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                required
                disabled={mode === 'edit'}
                value={formData.brandName}
                onChange={(e) => onChange({ ...formData, brandName: e.target.value })}
                placeholder="e.g. Vultr"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Brand Website
              </label>
              <input
                type="text"
                disabled={mode === 'edit'}
                value={formData.brandWebsite}
                onChange={(e) => onChange({ ...formData, brandWebsite: e.target.value })}
                placeholder="e.g. https://vultr.com"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Exact Claim / Coupon Landing URL * (Crucial for User Claiming)
            </label>
            <input
              type="url"
              required
              value={formData.claimUrl}
              onChange={(e) => onChange({ ...formData, claimUrl: e.target.value })}
              placeholder="e.g. https://www.vultr.com/promo/try250/"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Discount Value
              </label>
              <input
                type="text"
                value={formData.discountAmount}
                onChange={(e) => onChange({ ...formData, discountAmount: e.target.value })}
                placeholder="e.g. $250 free credits"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Promo Code (if any)
              </label>
              <input
                type="text"
                value={formData.promoCode}
                onChange={(e) => onChange({ ...formData, promoCode: e.target.value })}
                placeholder="e.g. TRY250"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Est. Commission
              </label>
              <input
                type="text"
                value={formData.commissionRate}
                onChange={(e) => onChange({ ...formData, commissionRate: e.target.value })}
                placeholder="e.g. $50 – $100 CPA"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Expiry Date (optional)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => onChange({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Deal Type
              </label>
              <select
                value={formData.dealType}
                onChange={(e) => onChange({ ...formData, dealType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="discount">Discount</option>
                <option value="credit">Credits</option>
                <option value="freebie">Freebie</option>
                <option value="trial">Trial</option>
                <option value="promo-code">Promo Code</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => onChange({ ...formData, shortDescription: e.target.value })}
              placeholder="Summary of what the deal gives and how to redeem it."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Flags / Checkboxes */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={formData.needsCreditCard}
                onChange={(e) => onChange({ ...formData, needsCreditCard: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Needs Credit Card</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isStudentDeal}
                onChange={(e) => onChange({ ...formData, isStudentDeal: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Student (.edu) Deal</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => onChange({ ...formData, isTrending: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Trending Deal</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isLimitedTime}
                onChange={(e) => onChange({ ...formData, isLimitedTime: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Limited Time Offer</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-zinc-400 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? 'Processing...'
                : mode === 'edit'
                ? 'Update Deal'
                : mode === 'customize'
                ? 'Publish to Catalog'
                : 'Save Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
