export type DealType = 'freebie' | 'discount' | 'trial' | 'credit' | 'promo-code';

export interface AdminStats {
  totalDeals: number;
  totalBrands: number;
  totalTopics: number;
  totalSubscribers: number;
  pendingSubmissions: number;
}

export interface DealItem {
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

export interface SubmissionItem {
  id: string;
  brandName: string;
  dealTitle: string;
  dealUrl: string;
  description?: string | null;
  submittedBy?: string | null;
  status: string;
  createdAt: string;
}

export interface DiscoveredDealItem {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  dealType: string;
  discountAmount: string;
  promoCode?: string | null;
  commissionRate?: string | null;
  brandName: string;
  brandWebsite: string;
  topicSlug: string;
  claimUrl: string;
  howToClaim: string[];
  keyBenefits: string[];
  eligibility: string[];
  termsUrl?: string | null;
  isStudentDeal: boolean;
  isStartupDeal: boolean;
  needsCreditCard: boolean;
  isTrending: boolean;
  isLimitedTime: boolean;
  canGenerateOwnCode?: boolean;
  codeGenerationType?: string;
  codeGenerationPortalUrl?: string;
  adminGuideSteps?: string[];
  isPublished: boolean;
  existingDealId?: string | null;
  existingIsActive?: boolean | null;
}

export interface DealFormData {
  title: string;
  brandName: string;
  brandWebsite: string;
  topicSlug: string;
  dealType: string;
  discountAmount: string;
  promoCode: string;
  commissionRate: string;
  claimUrl: string;
  shortDescription: string;
  expiryDate: string;
  isStudentDeal: boolean;
  needsCreditCard: boolean;
  isTrending: boolean;
  isLimitedTime: boolean;
}

export type AdminActiveTab = 'deals' | 'submissions' | 'crawler' | 'earnings';
export type DealsStatusFilter = 'all' | 'active' | 'inactive' | 'expired';
export type CrawlerHub = 'referral_programs' | 'direct_injection' | 'all';
export type CrawlerFilter = 'all' | 'pending' | 'published' | 'cloud' | 'ai' | 'student';

export interface AdminToastState {
  text: string;
  type: 'success' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}
