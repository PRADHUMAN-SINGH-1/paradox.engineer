export type DealType = 'freebie' | 'discount' | 'trial' | 'credit' | 'promo-code'

export interface DealWithBrandAndTopic {
  id: string
  title: string
  slug: string
  shortDescription: string
  fullDescription: string
  dealType: string
  discountAmount: string | null
  promoCode: string | null
  affiliateUrl: string | null
  claimUrl: string | null
  howToClaim: string
  keyBenefits: string
  eligibility: string
  termsUrl: string | null
  isStudentDeal: boolean
  isStartupDeal: boolean
  needsCreditCard: boolean
  isTrending: boolean
  isLimitedTime: boolean
  isActive: boolean
  clickCount: number
  viewCount: number
  expiryDate: Date | null
  brandId: string
  topicId: string
  createdAt: Date
  updatedAt: Date
  brand: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    website: string | null
  }
  topic: {
    id: string
    name: string
    slug: string
    icon: string | null
  }
}

export interface TopicWithCount {
  id: string
  name: string
  slug: string
  icon: string | null
  _count: {
    deals: number
  }
}

export interface BrandWithCount {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  website: string | null
  _count: {
    deals: number
  }
}

export const DEAL_TYPE_CONFIG: Record<DealType, { label: string; emoji: string; color: string }> = {
  'freebie': { label: 'Freebies', emoji: '🆓', color: 'bg-green-100 text-green-800' },
  'discount': { label: 'Discounts', emoji: '💸', color: 'bg-blue-100 text-blue-800' },
  'trial': { label: 'Trials', emoji: '⏱️', color: 'bg-purple-100 text-purple-800' },
  'credit': { label: 'Credits', emoji: '💳', color: 'bg-amber-100 text-amber-800' },
  'promo-code': { label: 'Promo Codes', emoji: '🏷️', color: 'bg-pink-100 text-pink-800' },
}

export const TOPIC_ICONS: Record<string, string> = {
  'ai': '🤖',
  'hosting-domains': '🌐',
  'productivity-and-docs': '📝',
  'vibe-coding': '💻',
  'ai-media': '🎨',
  'analytics-and-product': '📊',
  'creative': '🎭',
  'cloud-storage': '☁️',
  'sales-and-crm': '📈',
  'entertainment': '🎬',
  'courses-and-certifications': '🎓',
  'legal-hr-ops': '⚖️',
}
