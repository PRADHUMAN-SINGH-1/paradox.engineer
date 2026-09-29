'use client';

import React, { useState, useEffect } from 'react';
import AdminLoginGate from './components/AdminLoginGate';
import AdminHeader from './components/AdminHeader';
import AdminStatsCards from './components/AdminStatsCards';
import AdminTabsNav from './components/AdminTabsNav';
import DealsTable from './components/DealsTable';
import CrawlerStudio from './components/CrawlerStudio';
import PendingSubmissions from './components/PendingSubmissions';
import EarningsPanel from './components/EarningsPanel';
import GuidanceModal from './components/GuidanceModal';
import DealFormModal from './components/DealFormModal';
import AdminToast from './components/AdminToast';
import { getDealTargetSection } from '@/lib/admin/sections';
import type {
  AdminStats,
  DealItem,
  SubmissionItem,
  DiscoveredDealItem,
  DealFormData,
  AdminActiveTab,
  DealsStatusFilter,
  CrawlerHub,
  CrawlerFilter,
  AdminToastState,
} from '@/lib/admin/types';

const INITIAL_FORM_DATA: DealFormData = {
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
};

export default function AdminDashboardPage() {
  // 1. Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // 2. Navigation & Tabs
  const [activeTab, setActiveTab] = useState<AdminActiveTab>('deals');
  const [dealsFilter, setDealsFilter] = useState<DealsStatusFilter>('all');
  const [dealsSectionFilter, setDealsSectionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Data Collections
  const [stats, setStats] = useState<AdminStats>({
    totalDeals: 0,
    totalBrands: 0,
    totalTopics: 0,
    totalSubscribers: 0,
    pendingSubmissions: 0,
  });
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  // 4. Deal Discovery Crawler Studio State
  const [crawlerHub, setCrawlerHub] = useState<CrawlerHub>('referral_programs');
  const [crawlerFilter, setCrawlerFilter] = useState<CrawlerFilter>('all');
  const [crawlerSearch, setCrawlerSearch] = useState('');
  const [discoveredDeals, setDiscoveredDeals] = useState<DiscoveredDealItem[]>([]);
  const [crawlerLoading, setCrawlerLoading] = useState(false);
  const [crawlerActionLoading, setCrawlerActionLoading] = useState<string | null>(null);
  const [isBulkIngesting, setIsBulkIngesting] = useState(false);
  const [showCronGuide, setShowCronGuide] = useState(false);

  // 5. Modals & Actions
  const [selectedCrawlerDeal, setSelectedCrawlerDeal] = useState<DiscoveredDealItem | null>(null);
  const [customizingCandidate, setCustomizingCandidate] = useState<DiscoveredDealItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealItem | null>(null);
  const [formData, setFormData] = useState<DealFormData>(INITIAL_FORM_DATA);

  // 6. Notifications & Logs
  const [toast, setToast] = useState<AdminToastState | null>(null);
  const [recentlyIngestedSlug, setRecentlyIngestedSlug] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshLog, setRefreshLog] = useState<string | null>(null);

  // Helper to compose security headers strictly from stored credentials
  const getAdminHeaders = (): Record<string, string> => {
    const key =
      typeof window !== 'undefined'
        ? localStorage.getItem('paradox_admin_key') || ''
        : '';
    return {
      'x-admin-key': key,
      Authorization: key ? 'Basic ' + btoa(`admin:${key}`) : '',
    };
  };

  // Verify stored session on mount
  useEffect(() => {
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('paradox_admin_key') : null;
    if (savedKey) {
      fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: savedKey }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('paradox_admin_key');
            document.cookie = 'paradox_admin_key=; path=/; max-age=0';
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = adminKeyInput.trim();
    if (!key) {
      setAuthError('Please enter the admin master key.');
      return;
    }
    try {
      setAuthLoading(true);
      setAuthError(null);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (data.success) {
        const canonicalKey = data.key || key;
        localStorage.setItem('paradox_admin_key', canonicalKey);
        document.cookie = `paradox_admin_key=${encodeURIComponent(canonicalKey)}; path=/; max-age=604800; SameSite=Lax`;
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Access denied: Invalid master key.');
      }
    } catch {
      setAuthError('Unable to connect to authentication server. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('paradox_admin_key');
    document.cookie = 'paradox_admin_key=; path=/; max-age=0';
    setIsAuthenticated(false);
    setAdminKeyInput('');
    setDeals([]);
    setDiscoveredDeals([]);
    setSubmissions([]);
  };

  const [isDealsLoading, setIsDealsLoading] = useState(false);

  // Fetch catalog overview & deals
  const fetchOverview = async () => {
    try {
      setIsDealsLoading(true);
      const [overviewRes, dealsRes] = await Promise.all([
        fetch('/api/admin/overview', { headers: getAdminHeaders() }),
        fetch(`/api/admin/deals?filter=${dealsFilter}&q=${encodeURIComponent(searchQuery)}`, {
          headers: getAdminHeaders(),
        }),
      ]);

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        if (data.stats) setStats(data.stats);
        if (data.pendingSubmissions) setSubmissions(data.pendingSubmissions);
      }

      if (dealsRes.ok) {
        const data = await dealsRes.json();
        if (data.deals) setDeals(data.deals);
      }
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setIsDealsLoading(false);
    }
  };

  // Fetch discovered candidate deals for Crawler Studio
  const fetchDiscovered = async () => {
    try {
      setCrawlerLoading(true);
      const res = await fetch('/api/admin/crawler/discovered', {
        headers: getAdminHeaders(),
      });
      const data = await res.json().catch(() => null);
      if (data && Array.isArray(data.deals) && data.deals.length > 0) {
        setDiscoveredDeals(data.deals);
      }
    } catch (err) {
      console.error('Failed to load discovered deals:', err);
    } finally {
      setCrawlerLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOverview();
      fetchDiscovered();
    }
  }, [isAuthenticated, dealsFilter, searchQuery]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'crawler' && discoveredDeals.length === 0) {
      fetchDiscovered();
    }
  }, [isAuthenticated, activeTab]);

  // Ingest Deal from Crawler into Catalog with section routing
  const handleIngestDeal = async (
    deal: DiscoveredDealItem,
    customPromoCode?: string,
    customClaimUrl?: string
  ) => {
    try {
      setCrawlerActionLoading(deal.slug);
      const res = await fetch('/api/admin/crawler/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders(),
        },
        body: JSON.stringify({
          ...deal,
          promoCode: customPromoCode !== undefined ? customPromoCode : (deal.promoCode || null),
          claimUrl: customClaimUrl || deal.claimUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const targetSection = getDealTargetSection(deal);
        setRecentlyIngestedSlug(deal.slug);

        // Rich toast with instant navigation to target dashboard section
        setToast({
          text: `✓ Ingested "${deal.title}"! Filed under "${targetSection.label}".`,
          type: 'success',
          actionLabel: `View in ${targetSection.label} ➔`,
          onAction: () => {
            setActiveTab('deals');
            setDealsSectionFilter(targetSection.sectionId);
            setToast(null);
          },
        });
        setTimeout(() => setToast(null), 8000);

        setDiscoveredDeals((prev) =>
          prev.map((d) =>
            d.slug === deal.slug ? { ...d, isPublished: true, existingDealId: data.deal?.id } : d
          )
        );
        setSelectedCrawlerDeal(null);
        setCustomizingCandidate(null);
        fetchOverview();
      } else {
        alert(`Failed to ingest deal: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Network error during ingestion: ${String(err)}`);
    } finally {
      setCrawlerActionLoading(null);
    }
  };

  // Bulk Ingest Direct Deals
  const handleBulkIngestDirectDeals = async () => {
    const pendingDirect = discoveredDeals.filter((d) => !d.canGenerateOwnCode && !d.isPublished);
    if (pendingDirect.length === 0) {
      alert('All direct deals are already published in the catalog!');
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to 1-click ingest all ${pendingDirect.length} direct deals into the catalog?`
      )
    ) {
      return;
    }

    try {
      setIsBulkIngesting(true);
      let successCount = 0;
      for (const deal of pendingDirect) {
        setCrawlerActionLoading(deal.slug);
        const res = await fetch('/api/admin/crawler/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
          body: JSON.stringify(deal),
        });
        const data = await res.json();
        if (data.success) {
          successCount++;
          setDiscoveredDeals((prev) =>
            prev.map((d) =>
              d.slug === deal.slug ? { ...d, isPublished: true, existingDealId: data.deal?.id } : d
            )
          );
        }
      }
      setToast({
        text: `⚡ Successfully batch-ingested ${successCount} direct deals into the catalog!`,
        type: 'success',
        actionLabel: 'View Catalog Deals ➔',
        onAction: () => {
          setActiveTab('deals');
          setDealsSectionFilter('all');
          setToast(null);
        },
      });
      fetchOverview();
    } catch (err) {
      alert(`Bulk ingestion encountered an error: ${String(err)}`);
    } finally {
      setIsBulkIngesting(false);
      setCrawlerActionLoading(null);
    }
  };

  // Toggle active status
  const handleToggleDeal = async (dealId: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, isActive: !d.isActive } : d))
    );
    try {
      const res = await fetch(`/api/admin/deals/${dealId}/toggle`, {
        method: 'POST',
        headers: getAdminHeaders(),
      });
      if (!res.ok) fetchOverview();
    } catch {
      fetchOverview();
    }
  };

  // Delete deal
  const handleDeleteDeal = async (dealId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      fetchOverview();
    } catch (err) {
      console.error('Failed to delete deal:', err);
    }
  };

  // Approve community submission
  const handleApproveSubmission = async (submissionId: string) => {
    try {
      setRefreshLog(`Approving and publishing community submission ${submissionId}...`);
      const res = await fetch('/api/admin/approve-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ submissionId }),
      });
      const data = await res.json();
      if (data.success) {
        setRefreshLog(`Successfully approved: "${data.deal.title}" is now LIVE!`);
        const targetSection = getDealTargetSection(data.deal);
        setRecentlyIngestedSlug(data.deal?.slug || null);
        setToast({
          text: `✓ Approved "${data.deal.title}"! Automatically moved to "${targetSection.label}".`,
          type: 'success',
          actionLabel: `View in ${targetSection.label} ➔`,
          onAction: () => {
            setActiveTab('deals');
            setDealsSectionFilter(targetSection.sectionId);
            setToast(null);
          },
        });
        setTimeout(() => setToast(null), 8000);
        fetchOverview();
      } else {
        setRefreshLog(`Error: ${data.error || 'Failed to approve'}`);
      }
    } catch (err) {
      setRefreshLog(`Network error: ${String(err)}`);
    }
  };

  // Run deal discovery & expiration check
  const handleRunRefresher = async () => {
    try {
      setIsRefreshing(true);
      setRefreshLog('Initiating autonomous deal discovery crawler & expiration check...');
      const res = await fetch('/api/cron/refresh-deals', {
        method: 'POST',
        headers: getAdminHeaders(),
      });
      const result = await res.json();
      if (result.success) {
        setRefreshLog(
          `Sync Completed Successfully!\n• Offers Crawled: ${result.totalCrawled}\n• New Deals Added: ${result.newDealsAdded}\n• Existing Deals Updated: ${result.updatedDeals}\n• Expired Deals Deactivated: ${result.expiredDealsDeactivated || 0}\n• Timestamp: ${new Date(result.timestamp).toLocaleTimeString()}`
        );
        fetchOverview();
        fetchDiscovered();
      } else {
        setRefreshLog(`Crawler failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      setRefreshLog(`Network failure: ${String(err)}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open modals
  const handleOpenAddModal = () => {
    setFormData(INITIAL_FORM_DATA);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (deal: DealItem) => {
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

  const handleOpenCustomizeModal = (deal: DiscoveredDealItem) => {
    setCustomizingCandidate(deal);
    setFormData({
      title: deal.title,
      brandName: deal.brandName,
      brandWebsite: deal.brandWebsite,
      topicSlug: deal.topicSlug,
      dealType: deal.dealType,
      discountAmount: deal.discountAmount,
      promoCode: deal.promoCode || '',
      commissionRate: deal.commissionRate || '',
      claimUrl: deal.claimUrl,
      shortDescription: deal.shortDescription,
      expiryDate: '',
      isStudentDeal: deal.isStudentDeal,
      needsCreditCard: deal.needsCreditCard,
      isTrending: deal.isTrending,
      isLimitedTime: deal.isLimitedTime,
    });
  };

  // Save Add/Edit
  const handleSaveDealForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (customizingCandidate) {
      const mergedDeal: DiscoveredDealItem = {
        ...customizingCandidate,
        title: formData.title,
        brandName: formData.brandName,
        brandWebsite: formData.brandWebsite,
        topicSlug: formData.topicSlug,
        dealType: formData.dealType,
        discountAmount: formData.discountAmount,
        promoCode: formData.promoCode || null,
        commissionRate: formData.commissionRate || null,
        claimUrl: formData.claimUrl,
        shortDescription: formData.shortDescription,
        isStudentDeal: formData.isStudentDeal,
        needsCreditCard: formData.needsCreditCard,
        isTrending: formData.isTrending,
        isLimitedTime: formData.isLimitedTime,
      };
      await handleIngestDeal(mergedDeal, formData.promoCode, formData.claimUrl);
      setCustomizingCandidate(null);
      return;
    }

    try {
      if (editingDeal) {
        const res = await fetch(`/api/admin/deals/${editingDeal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setEditingDeal(null);
          fetchOverview();
        } else {
          alert(data.error || 'Failed to update deal');
        }
      } else {
        const res = await fetch('/api/admin/deals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setIsAddModalOpen(false);
          fetchOverview();
        } else {
          alert(data.error || 'Failed to create deal');
        }
      }
    } catch (err) {
      alert(`Error saving deal: ${String(err)}`);
    }
  };

  // Initial session verification loader
  // Render login panel immediately when unauthenticated
  if (!isAuthenticated) {
    return (
      <AdminLoginGate
        adminKeyInput={adminKeyInput}
        setAdminKeyInput={setAdminKeyInput}
        showKey={showKey}
        setShowKey={setShowKey}
        authError={authError}
        authLoading={authLoading}
        onSubmit={handleLogin}
      />
    );
  }

  const referralDealsCount = discoveredDeals.filter((d) => d.canGenerateOwnCode).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      {/* 1. Executive Header */}
      <AdminHeader
        isRefreshing={isRefreshing}
        onRunRefresher={handleRunRefresher}
        onOpenAddModal={handleOpenAddModal}
        onLogout={handleLogout}
      />

      {/* 2. Crawler Sync Output Box */}
      {refreshLog && (
        <div className="bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl text-xs border border-emerald-500/30 flex justify-between items-start gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none">⚡</span>
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{refreshLog}</pre>
          </div>
          <button
            type="button"
            onClick={() => setRefreshLog(null)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs px-2.5 py-1 rounded-lg bg-white/60 dark:bg-zinc-800/80 transition cursor-pointer shrink-0 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Summary KPI Cards */}
      <AdminStatsCards stats={stats} pendingSubmissionsCount={submissions.length} />

      {/* 4. Tab Navigation */}
      <AdminTabsNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        totalDealsCount={deals.length}
        crawlerTotalCount={discoveredDeals.length}
        customCodeCount={referralDealsCount}
        submissionsCount={submissions.length}
      />

      {/* 5. Tab Views */}
      {activeTab === 'deals' && (
        <DealsTable
          deals={deals}
          selectedSection={dealsSectionFilter}
          onSelectSection={setDealsSectionFilter}
          dealsFilter={dealsFilter}
          onSelectFilter={setDealsFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          recentlyIngestedSlug={recentlyIngestedSlug}
          onToggleDeal={handleToggleDeal}
          onEditDeal={handleOpenEditModal}
          onDeleteDeal={handleDeleteDeal}
          isLoading={isDealsLoading}
          onRefresh={fetchOverview}
        />
      )}

      {activeTab === 'crawler' && (
        <CrawlerStudio
          crawlerHub={crawlerHub}
          onSelectHub={setCrawlerHub}
          crawlerFilter={crawlerFilter}
          onSelectFilter={setCrawlerFilter}
          crawlerSearch={crawlerSearch}
          onSearchChange={setCrawlerSearch}
          discoveredDeals={discoveredDeals}
          crawlerLoading={crawlerLoading}
          crawlerActionLoading={crawlerActionLoading}
          isBulkIngesting={isBulkIngesting}
          showCronGuide={showCronGuide}
          onToggleCronGuide={() => setShowCronGuide(!showCronGuide)}
          onRefreshCandidates={fetchDiscovered}
          onRunCrawler={handleRunRefresher}
          isRefreshing={isRefreshing}
          onBulkIngestDirect={handleBulkIngestDirectDeals}
          onOpenGuidance={setSelectedCrawlerDeal}
          onOpenCustomize={handleOpenCustomizeModal}
          onIngestDeal={handleIngestDeal}
          onNavigateToSection={(sectionId) => {
            setActiveTab('deals');
            setDealsSectionFilter(sectionId);
          }}
        />
      )}

      {activeTab === 'submissions' && (
        <PendingSubmissions
          submissions={submissions}
          onApprove={handleApproveSubmission}
        />
      )}

      {activeTab === 'earnings' && <EarningsPanel />}

      {/* 6. Guidance Modal */}
      <GuidanceModal
        deal={selectedCrawlerDeal}
        onClose={() => setSelectedCrawlerDeal(null)}
        onIngest={handleIngestDeal}
        loading={crawlerActionLoading === selectedCrawlerDeal?.slug}
      />

      {/* 7. Add / Edit / Customize Form Modal */}
      <DealFormModal
        isOpen={isAddModalOpen || !!editingDeal || !!customizingCandidate}
        mode={editingDeal ? 'edit' : customizingCandidate ? 'customize' : 'add'}
        title={
          editingDeal
            ? `Edit Deal: ${editingDeal.title}`
            : customizingCandidate
            ? `Customize Discovered Deal: ${customizingCandidate.brandName}`
            : 'Add New Curated Deal'
        }
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSaveDealForm}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDeal(null);
          setCustomizingCandidate(null);
        }}
        loading={
          customizingCandidate ? crawlerActionLoading === customizingCandidate.slug : false
        }
      />

      {/* 8. Floating Action Toast */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
