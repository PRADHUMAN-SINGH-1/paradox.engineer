'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import ExpiryBadge from '@/components/ExpiryBadge';

interface AdminStats {
  totalDeals: number;
  totalBrands: number;
  totalTopics: number;
  totalSubscribers: number;
  pendingSubmissions: number;
}

interface DealItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  dealType: string;
  discountAmount?: string | null;
  promoCode?: string | null;
  commissionRate?: string | null;
  claimUrl?: string | null;
  expiryDate?: string | null;
  isActive: boolean;
  isTrending: boolean;
  isLimitedTime: boolean;
  isStudentDeal: boolean;
  needsCreditCard: boolean;
  clickCount: number;
  viewCount: number;
  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    website?: string | null;
  };
  topic?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface SubmissionItem {
  id: string;
  brandName: string;
  dealTitle: string;
  dealUrl: string;
  description?: string | null;
  submittedBy?: string | null;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'deals' | 'submissions' | 'crawler' | 'earnings'>('deals');
  const [dealsFilter, setDealsFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshLog, setRefreshLog] = useState<string | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const [stats, setStats] = useState<AdminStats>({
    totalDeals: 0,
    totalBrands: 0,
    totalTopics: 0,
    totalSubscribers: 0,
    pendingSubmissions: 0,
  });

  const [deals, setDeals] = useState<DealItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealItem | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    brandName: '',
    brandWebsite: '',
    topicSlug: 'ai',
    dealType: 'discount',
    discountAmount: '',
    promoCode: '',
    commissionRate: '',
    claimUrl: '',
    shortDescription: '',
    expiryDate: '',
    isStudentDeal: false,
    needsCreditCard: false,
    isTrending: false,
    isLimitedTime: false,
  });

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const [overviewRes, dealsRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch(`/api/admin/deals?filter=${dealsFilter}&q=${encodeURIComponent(searchQuery)}`),
      ]);

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setStats(data.stats);
        setSubmissions(data.pendingSubmissions || []);
      }

      if (dealsRes.ok) {
        const data = await dealsRes.json();
        setDeals(data.deals || []);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [dealsFilter, searchQuery]);

  // 1-Click Toggle Deal Active
  const handleToggleDeal = async (dealId: string) => {
    // Optimistic UI update
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, isActive: !d.isActive } : d))
    );

    try {
      const res = await fetch(`/api/admin/deals/${dealId}/toggle`, { method: 'POST' });
      if (!res.ok) {
        // Rollback if failed
        fetchOverview();
      }
    } catch (_) {
      fetchOverview();
    }
  };

  // Delete Deal
  const handleDeleteDeal = async (dealId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    try {
      await fetch(`/api/admin/deals/${dealId}`, { method: 'DELETE' });
      fetchOverview();
    } catch (err) {
      console.error('Failed to delete deal:', err);
    }
  };

  // Approve Submission
  const handleApproveSubmission = async (submissionId: string) => {
    try {
      setRefreshLog(`Approving and publishing community submission ${submissionId}...`);
      const res = await fetch('/api/admin/approve-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId }),
      });
      const data = await res.json();
      if (data.success) {
        setRefreshLog(`Successfully approved: "${data.deal.title}" is now LIVE!`);
        fetchOverview();
      } else {
        setRefreshLog(`Error: ${data.error || 'Failed to approve'}`);
      }
    } catch (err) {
      setRefreshLog(`Network error: ${String(err)}`);
    }
  };

  // Run Crawler / Deal Refresh
  const handleRunRefresher = async () => {
    try {
      setIsRefreshing(true);
      setRefreshLog('Initiating autonomous deal discovery crawler & expiration check...');
      const res = await fetch('/api/cron/refresh-deals', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setRefreshLog(
          `Sync Completed Successfully!\n• Offers Crawled: ${result.totalCrawled}\n• New Deals Added: ${result.newDealsAdded}\n• Existing Deals Updated: ${result.updatedDeals}\n• Expired Deals Deactivated: ${result.expiredDealsDeactivated || 0}\n• Timestamp: ${new Date(result.timestamp).toLocaleTimeString()}`
        );
        fetchOverview();
      } else {
        setRefreshLog(`Crawler failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      setRefreshLog(`Network failure: ${String(err)}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Save New Deal
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setFormData({
          title: '',
          brandName: '',
          brandWebsite: '',
          topicSlug: 'ai',
          dealType: 'discount',
          discountAmount: '',
          promoCode: '',
          commissionRate: '',
          claimUrl: '',
          shortDescription: '',
          expiryDate: '',
          isStudentDeal: false,
          needsCreditCard: false,
          isTrending: false,
          isLimitedTime: false,
        });
        fetchOverview();
      } else {
        alert(data.error || 'Failed to create deal');
      }
    } catch (err) {
      alert(`Error creating deal: ${String(err)}`);
    }
  };

  // Open Edit Modal
  const openEditModal = (deal: DealItem) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      brandName: deal.brand.name,
      brandWebsite: deal.brand.website || '',
      topicSlug: deal.topic?.slug || 'ai',
      dealType: deal.dealType,
      discountAmount: deal.discountAmount || '',
      promoCode: deal.promoCode || '',
      commissionRate: deal.commissionRate || '',
      claimUrl: deal.claimUrl || '',
      shortDescription: deal.shortDescription || '',
      expiryDate: deal.expiryDate ? new Date(deal.expiryDate).toISOString().split('T')[0] : '',
      isStudentDeal: deal.isStudentDeal,
      needsCreditCard: deal.needsCreditCard,
      isTrending: deal.isTrending,
      isLimitedTime: deal.isLimitedTime,
    });
  };

  // Save Edit Deal
  const handleUpdateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    try {
      const res = await fetch(`/api/admin/deals/${editingDeal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          discountAmount: formData.discountAmount,
          promoCode: formData.promoCode,
          commissionRate: formData.commissionRate,
          claimUrl: formData.claimUrl,
          shortDescription: formData.shortDescription,
          expiryDate: formData.expiryDate || null,
          isStudentDeal: formData.isStudentDeal,
          needsCreditCard: formData.needsCreditCard,
          isTrending: formData.isTrending,
          isLimitedTime: formData.isLimitedTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditingDeal(null);
        fetchOverview();
      } else {
        alert(data.error || 'Failed to update deal');
      }
    } catch (err) {
      alert(`Error updating deal: ${String(err)}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Paradox Deal Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage live catalog offers, exact redemption URLs, automated crawler, and Skimlinks monetization.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleRunRefresher}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🔄</span>
            <span>{isRefreshing ? 'Running Sync...' : 'Sync Crawler'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                brandName: '',
                brandWebsite: '',
                topicSlug: 'ai',
                dealType: 'discount',
                discountAmount: '',
                promoCode: '',
                commissionRate: '',
                claimUrl: '',
                shortDescription: '',
                expiryDate: '',
                isStudentDeal: false,
                needsCreditCard: false,
                isTrending: false,
                isLimitedTime: false,
              });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-sm leading-none">+</span>
            <span>Add New Deal</span>
          </button>
        </div>
      </div>

      {/* Crawler Status Box */}
      {refreshLog && (
        <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-xs border border-slate-800 flex justify-between items-start shadow-md">
          <pre className="whitespace-pre-wrap font-mono leading-relaxed">{refreshLog}</pre>
          <button
            type="button"
            onClick={() => setRefreshLog(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">Active Catalog Perks</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalDeals}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium flex items-center gap-1">
            <span>●</span> All verified & indexed
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">Covered Brands</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalBrands}</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1.5">Anthropic, OpenAI, Civo...</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">Curated Topics</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalTopics}</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1.5">12 categories populated</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-1">Pending Submissions</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{submissions.length}</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1.5">Community queue</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('deals')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'deals'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          All Deals ({deals.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crawler')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'crawler'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>🤖 Auto-Crawler & Ingestion</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-mono">
            Auto-Sync
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'submissions'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>Pending Submissions</span>
          {submissions.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white">
              {submissions.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('earnings')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'earnings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          Skimlinks Earnings & India Payouts
        </button>
      </div>

      {/* TAB 1: ALL DEALS MANAGEMENT */}
      {activeTab === 'deals' && (
        <div className="space-y-4">
          {/* Controls: Search & Status Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/80 dark:border-zinc-800 text-xs">
              {(['all', 'active', 'inactive', 'expired'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setDealsFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg transition font-medium capitalize cursor-pointer ${
                    dealsFilter === filter
                      ? 'bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals or brands..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          {/* Deals Table */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Deal Title</th>
                    <th className="py-3 px-4">Value / Code</th>
                    <th className="py-3 px-4">Est. Commission</th>
                    <th className="py-3 px-4">Claim Landing URL</th>
                    <th className="py-3 px-4">Validity</th>
                    <th className="py-3 px-4">Claims</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {deals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition">
                      {/* Brand Logo & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <BrandLogo
                            name={deal.brand.name}
                            logoUrl={deal.brand.logoUrl}
                            website={deal.brand.website}
                            size="sm"
                          />
                          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">
                            {deal.brand.name}
                          </span>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-3 px-4 max-w-xs">
                        <Link
                          href={`/resources/${deal.slug}`}
                          className="font-medium text-slate-900 dark:text-zinc-100 hover:text-blue-600 line-clamp-1"
                        >
                          {deal.title}
                        </Link>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 capitalize">
                          {deal.dealType}
                        </span>
                      </td>

                      {/* Discount & Code */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 block whitespace-nowrap">
                          {deal.discountAmount || 'Free'}
                        </span>
                        {deal.promoCode && (
                          <span className="font-mono text-[10px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
                            {deal.promoCode}
                          </span>
                        )}
                      </td>

                      {/* Est. Commission */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800 text-[11px]">
                          <span>💰</span>
                          <span>{deal.commissionRate || 'Standard CPA'}</span>
                        </span>
                      </td>

                      {/* Exact Claim URL */}
                      <td className="py-3 px-4 max-w-[180px]">
                        <a
                          href={deal.claimUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 truncate flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span className="truncate">{deal.claimUrl || 'None'}</span>
                          <span className="shrink-0">↗</span>
                        </a>
                      </td>

                      {/* Expiry Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <ExpiryBadge expiryDate={deal.expiryDate} isLimitedTime={deal.isLimitedTime} />
                      </td>

                      {/* Claims / Impressions */}
                      <td className="py-3 px-4 text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                        {deal.clickCount.toLocaleString()} / {deal.viewCount.toLocaleString()}
                      </td>

                      {/* 1-Click Toggle Active */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleDeal(deal.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                            deal.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {deal.isActive ? 'Active' : 'Paused'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(deal)}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDeal(deal.id, deal.title)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Community Submitted Deals</h3>

          {submissions.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8">
              <p className="text-3xl mb-2">🎉</p>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">No pending submissions</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">All community perks have been reviewed and published.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissions.map((sub) => (
                <div key={sub.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {sub.brandName}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{sub.dealTitle}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-400">{sub.description}</p>

                  <div className="text-xs">
                    <span className="text-slate-400">Target URL: </span>
                    <a href={sub.dealUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-mono text-[11px] truncate inline-block max-w-xs">
                      {sub.dealUrl} ↗
                    </a>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleApproveSubmission(sub.id)}
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
      )}

      {/* TAB 2: AUTONOMOUS CRAWLER & COMMISSION ENGINE */}
      {activeTab === 'crawler' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Autonomous Pipeline Active</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Automated Deal Discovery & Commission Engine
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Paradox continuously crawls verified developer perks, cloud infrastructure credits, and software discounts, automatically attaches high-paying affiliate commissions, and publishes them live to your catalog.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunRefresher}
                disabled={isRefreshing}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <span>{isRefreshing ? '⏳' : '⚡'}</span>
                <span>{isRefreshing ? 'Running Discovery...' : 'Scan & Ingest Deals Now'}</span>
              </button>
            </div>
          </div>

          {/* 3 Step Workflow Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Continuous Ingestion</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                The crawler checks cloud providers, AI platforms, and developer tooling programs for new sign-up credits, promo codes, and student bundles.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Commission Tagging</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Every perk is labeled with its estimated commission rate ($50&ndash;$125 CPA, 20%&ndash;50% RevShare) so you always know which deals generate the highest earnings.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dynamic Link Monetization</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                When readers click &ldquo;Claim Deal&rdquo;, Skimlinks dynamically appends your publisher ID (<code className="text-[11px] font-mono bg-slate-100 dark:bg-zinc-800 px-1 py-0.5 rounded">310009X1798390</code>). Revenue tracks automatically!
              </p>
            </div>
          </div>

          {/* Webhook & Cron Job Automation Section */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-semibold mb-2">
                <span>⏰</span>
                <span>100% Hands-Free Scheduling</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Set Up Recurring 6-Hour Automated Ingestion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                To have new deals ingested and expired deals pruned automatically without opening this dashboard, hook up your background cron endpoint to any free cron scheduler (such as cron-job.org, EasyCron, or GitHub Actions).
              </p>
            </div>

            {/* Webhook URL bar */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Your Automated Sync Webhook URL (Supports GET and POST)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://paradox.engineer/api/cron/refresh-deals"
                  className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-800 dark:text-zinc-200 select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('https://paradox.engineer/api/cron/refresh-deals');
                    setCopiedWebhook(true);
                    setTimeout(() => setCopiedWebhook(false), 2500);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition shrink-0 cursor-pointer"
                >
                  {copiedWebhook ? '✓ Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-xl p-4 border border-slate-200/80 dark:border-zinc-800/80 space-y-3 text-xs">
              <div className="font-semibold text-slate-800 dark:text-zinc-200">
                Quick Setup with cron-job.org (Free in 2 Minutes):
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-zinc-400">
                <li>Create a free account on <a href="https://cron-job.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">cron-job.org</a>.</li>
                <li>Click <strong>&ldquo;Create Cronjob&rdquo;</strong>.</li>
                <li>Title: <code className="font-mono bg-white dark:bg-zinc-900 px-1 py-0.5 rounded">Paradox Deals Auto-Ingest</code></li>
                <li>URL: <code className="font-mono bg-white dark:bg-zinc-900 px-1 py-0.5 rounded">https://paradox.engineer/api/cron/refresh-deals</code></li>
                <li>Schedule: Set execution to <strong>&ldquo;Every 6 hours&rdquo;</strong> (or every 12 hours).</li>
                <li>Save! Your catalog will automatically crawl new deals, tag estimated commissions, and archive expired deals forever.</li>
              </ol>
            </div>
          </div>

          {/* High Commission Reference Table */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Estimated Commission Payouts by Vertical
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Expected earnings from merchants currently active in your catalog:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Cloud & Hosting</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">$50 &ndash; $125 CPA</div>
                <div className="text-[11px] text-slate-500">Cloudways, DigitalOcean, Vultr</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Productivity & SaaS</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">20% &ndash; 50% RevShare</div>
                <div className="text-[11px] text-slate-500">Notion, Cursor, Canva, Miro</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Security & VPN</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">40% &ndash; 100% CPA</div>
                <div className="text-[11px] text-slate-500">NordVPN, ExpressVPN, Surfshark</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">EdTech & Courses</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">15% &ndash; 45% Sale</div>
                <div className="text-[11px] text-slate-500">Coursera, DataCamp, Educative</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKIMLINKS MONETIZATION & INDIA PAYOUT SETUP */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-2">
                <span>💰</span>
                <span>Skimlinks Active Monetization</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                How You Earn & Receive Payouts in India
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Your Skimlinks publisher tracking tag (<code className="font-mono bg-slate-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-slate-800 dark:text-zinc-200">310009X1798390.skimlinks.js</code>) is embedded in the root layout and tracks every outbound click.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">1. Zero Manual Links Needed</div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  When visitors click &ldquo;Claim Deal&rdquo; on any partner offer (DigitalOcean, Vultr, Adobe, Canva, Miro, Cloudways, Coursera), Skimlinks dynamically embeds your publisher affiliate ID and sets a 30-day tracking cookie.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">2. Real-Time Conversion Tracking</div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  When a reader registers, buys a subscription, or uses a promo code, the merchant credits your publisher account. You can monitor live performance in the Skimlinks Hub.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">3. Direct Deposit to Indian Bank Account</div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Skimlinks pays publishers in India via <strong>Direct Electronic Funds Transfer (Wire/NEFT)</strong> or <strong>PayPal</strong> once your monthly balance hits the minimum $10 threshold.
                </p>
              </div>
            </div>
          </div>

          {/* India Payout Configuration Guide */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Indian Publisher Bank Account Setup Checklist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>🏦</span>
                  <span>Direct Bank Wire (India)</span>
                </div>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Navigate to Skimlinks &rarr; <strong>Payment Details</strong> &rarr; Select <strong>Direct Deposit / Wire Transfer</strong>. Enter your Indian bank&apos;s <strong>SWIFT/BIC code</strong> and your <strong>Account Number / IFSC</strong>. Funds are converted into INR at current forex rates.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>🅿️</span>
                  <span>PayPal (Instant Auto-Sweep to Bank)</span>
                </div>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Link your PayPal email address. Indian PayPal accounts automatically auto-sweep foreign currency into your verified Indian bank account daily with FIRC (Foreign Inward Remittance Certificate).
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://hub.skimlinks.com/settings/payment"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition flex items-center gap-1.5"
              >
                <span>Open Skimlinks Payment Settings</span>
                <span>↗</span>
              </a>

              <a
                href="https://hub.skimlinks.com/reports/performance"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 transition flex items-center gap-1.5"
              >
                <span>View Real-Time Click & Commission Reports</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT DEAL MODAL */}
      {(isAddModalOpen || editingDeal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingDeal ? `Edit Deal: ${editingDeal.title}` : 'Add New Curated Deal'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDeal(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingDeal ? handleUpdateDeal : handleCreateDeal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Vultr $250 Cloud Credits for New Users"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {!editingDeal && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      placeholder="e.g. Vultr"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Brand Website</label>
                    <input
                      type="text"
                      value={formData.brandWebsite}
                      onChange={(e) => setFormData({ ...formData, brandWebsite: e.target.value })}
                      placeholder="e.g. https://vultr.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Exact Claim / Coupon Landing URL * (Crucial for Redirection)
                </label>
                <input
                  type="url"
                  required
                  value={formData.claimUrl}
                  onChange={(e) => setFormData({ ...formData, claimUrl: e.target.value })}
                  placeholder="e.g. https://www.vultr.com/promo/try250/"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Discount Value</label>
                  <input
                    type="text"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                    placeholder="e.g. $250 free credits"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Promo Code (if any)</label>
                  <input
                    type="text"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                    placeholder="e.g. TRY250"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Est. Commission</label>
                  <input
                    type="text"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                    placeholder="e.g. $50 – $100 CPA"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Expiry Date (optional)</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Deal Type</label>
                  <select
                    value={formData.dealType}
                    onChange={(e) => setFormData({ ...formData, dealType: e.target.value })}
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
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Summary of what the deal gives and how to redeem it."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.needsCreditCard}
                    onChange={(e) => setFormData({ ...formData, needsCreditCard: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Needs Credit Card</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.isStudentDeal}
                    onChange={(e) => setFormData({ ...formData, isStudentDeal: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Student (.edu) Deal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Trending Deal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.isLimitedTime}
                    onChange={(e) => setFormData({ ...formData, isLimitedTime: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Limited Time Offer</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingDeal(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-zinc-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  {editingDeal ? 'Update Deal' : 'Save Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
