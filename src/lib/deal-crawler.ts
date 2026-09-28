export interface ScrapedDeal {
  title: string
  slug: string
  shortDescription: string
  fullDescription: string
  dealType: 'freebie' | 'discount' | 'trial' | 'credit' | 'promo-code'
  discountAmount: string
  promoCode?: string
  commissionRate?: string
  brandName: string
  brandWebsite: string
  topicSlug: string
  claimUrl: string
  howToClaim: string[]
  keyBenefits: string[]
  eligibility: string[]
  termsUrl?: string
  isStudentDeal: boolean
  isStartupDeal: boolean
  needsCreditCard: boolean
  isTrending: boolean
  isLimitedTime: boolean
}

/**
 * Deal Crawler & Discovery Module
 * Aggregates fresh digital discounts, free cloud credits, AI platform tokens,
 * developer tooling perks, and student offers.
 */
export async function fetchDiscoveredDeals(): Promise<ScrapedDeal[]> {
  // Collection of verified high-value digital deals and fresh promotional offers
  const discoveryPool: ScrapedDeal[] = [
    {
      title: 'Perplexity Pro 1 Year Free for Students & Educators',
      slug: 'perplexity-pro-student',
      shortDescription: '12 months free Perplexity Pro with AI research models',
      fullDescription: 'Perplexity offers 1 year of free Perplexity Pro to verified students and educators. Get unlimited Pro searches, access to Claude 3.5 Sonnet, GPT-4o, and file analysis.',
      dealType: 'freebie',
      discountAmount: '1 Year Free ($240 Value)',
      brandName: 'Perplexity AI',
      brandWebsite: 'https://perplexity.ai',
      topicSlug: 'ai',
      claimUrl: 'https://perplexity.ai/pro',
      howToClaim: [
        'Visit perplexity.ai and sign up with your verified .edu email',
        'Head to account settings and locate student benefits',
        'Complete the student verification via school single sign-on',
        'Perplexity Pro upgrades immediately for 12 months',
      ],
      keyBenefits: [
        'Unlimited Pro Search with advanced research queries',
        'Access to Claude 3.5 Sonnet, GPT-4o, and DeepSeek R1',
        'Large file and PDF uploads for deep synthesis',
        'Custom AI collections and shareable knowledge bases',
      ],
      eligibility: [
        'Must have active academic or student status',
        'Valid recognized institutional .edu email required',
      ],
      isStudentDeal: true,
      isStartupDeal: false,
      needsCreditCard: false,
      isTrending: true,
      isLimitedTime: true,
    },
    {
      title: 'DeepSeek API $5 Free Signup Credits for Developers',
      slug: 'deepseek-api-credits',
      shortDescription: '$5 free API credits for DeepSeek-V3 and DeepSeek-R1',
      fullDescription: 'New developer accounts on DeepSeek Open Platform receive $5 in free API credits. Benefit from industry-leading cost-efficiency for reasoning models.',
      dealType: 'credit',
      discountAmount: '$5 Free Credits (~2.5M Tokens)',
      brandName: 'DeepSeek',
      brandWebsite: 'https://deepseek.com',
      topicSlug: 'ai',
      claimUrl: 'https://platform.deepseek.com',
      howToClaim: [
        'Navigate to platform.deepseek.com and register',
        'Verify your phone number and email',
        'Navigate to Top Up / API keys to activate promotional balance',
      ],
      keyBenefits: [
        'Direct API access to DeepSeek-R1 and DeepSeek-V3',
        'Ultra-low token pricing with unmatched price-to-performance',
        'Compatible with standard OpenAI client libraries',
      ],
      eligibility: [
        'New account registrations only',
        'Valid SMS phone verification',
      ],
      isStudentDeal: false,
      isStartupDeal: false,
      needsCreditCard: false,
      isTrending: true,
      isLimitedTime: false,
    },
    {
      title: 'Supabase Launch Week: $100 Cloud Credits for Startups',
      slug: 'supabase-credits',
      shortDescription: '$100 in database and backend hosting credits',
      fullDescription: 'Supabase provides $100 in credits for developers launching new projects. Includes Postgres database, Auth, Storage, Edge Functions, and Vector search.',
      dealType: 'credit',
      discountAmount: '$100 Free Credits',
      brandName: 'Supabase',
      brandWebsite: 'https://supabase.com',
      topicSlug: 'cloud-storage',
      claimUrl: 'https://supabase.com/dashboard',
      howToClaim: [
        'Create a free Supabase account using GitHub',
        'Create your new organization and project',
        'Apply the promotional welcome coupon in billing settings',
      ],
      keyBenefits: [
        'Full managed PostgreSQL instance with pgvector',
        'Integrated real-time subscriptions and Edge Functions',
        'Built-in Row Level Security and Authentication',
      ],
      eligibility: [
        'First-time Supabase organizations',
        'Must link active GitHub developer account',
      ],
      isStudentDeal: false,
      isStartupDeal: true,
      needsCreditCard: true,
      isTrending: true,
      isLimitedTime: false,
    },
    {
      title: 'Cursor AI Code Editor: 2 Weeks Free Pro Trial',
      slug: 'cursor-pro-trial',
      shortDescription: '14-day free trial of Cursor Pro AI code companion',
      fullDescription: 'Experience intelligent code completion, codebase chat, and multi-file editing with 14 days of free Cursor Pro. Powered by leading LLMs.',
      dealType: 'trial',
      discountAmount: '14 Days Free Pro',
      brandName: 'Cursor',
      brandWebsite: 'https://cursor.com',
      topicSlug: 'vibe-coding',
      claimUrl: 'https://cursor.com',
      howToClaim: [
        'Download Cursor editor from cursor.com',
        'Install and sign in with GitHub or Google',
        'Pro trial starts automatically upon first sign in',
      ],
      keyBenefits: [
        '500 fast GPT-4o and Claude 3.5 Sonnet queries per month',
        'Unlimited slow/standard AI completions',
        'Full codebase indexing and semantic search',
      ],
      eligibility: [
        'New Cursor installations and accounts',
      ],
      isStudentDeal: true,
      isStartupDeal: false,
      needsCreditCard: false,
      isTrending: true,
      isLimitedTime: false,
    },
    {
      title: 'Neon Serverless Postgres: Free Tier with 0.5 GiB Storage & Branching',
      slug: 'neon-postgres-free',
      shortDescription: 'Free serverless Postgres with instant database branching',
      fullDescription: 'Neon provides a generous lifetime free tier featuring serverless PostgreSQL with database branching, point-in-time restore, and auto-suspend compute.',
      dealType: 'freebie',
      discountAmount: '100% Free Tier',
      brandName: 'Neon',
      brandWebsite: 'https://neon.tech',
      topicSlug: 'cloud-storage',
      claimUrl: 'https://neon.tech',
      howToClaim: [
        'Sign up at neon.tech with GitHub or Google',
        'Create your first database project',
        'Connect using standard connection string in seconds',
      ],
      keyBenefits: [
        '0.5 GiB free SSD storage with compute auto-suspend',
        'Instant copy-on-write branching for dev & testing environments',
        'Compatible with Prisma, Drizzle, and standard pg drivers',
      ],
      eligibility: [
        'Open to all developers worldwide',
        'No credit card required',
      ],
      isStudentDeal: true,
      isStartupDeal: true,
      needsCreditCard: false,
      isTrending: false,
      isLimitedTime: false,
    },
    {
      title: 'ElevenLabs AI Voice: 10,000 Free Characters Every Month',
      slug: 'elevenlabs-free-tier',
      shortDescription: '10,000 monthly voice synthesis characters free',
      fullDescription: 'ElevenLabs offers 10,000 characters per month on their free tier. Generate realistic speech in 29 languages with dozens of default voices.',
      dealType: 'freebie',
      discountAmount: '10,000 Characters/Month',
      brandName: 'ElevenLabs',
      brandWebsite: 'https://elevenlabs.io',
      topicSlug: 'ai-media',
      claimUrl: 'https://elevenlabs.io',
      howToClaim: [
        'Visit elevenlabs.io and create a free account',
        'Access VoiceLab and Speech Synthesis dashboard',
        'Monthly quota refreshes automatically on billing cycle',
      ],
      keyBenefits: [
        'Industry-leading humanlike voice synthesis',
        'Text-to-speech in 29+ languages',
        'API access included with standard free rate limits',
      ],
      eligibility: [
        'Available to all users globally',
      ],
      isStudentDeal: false,
      isStartupDeal: false,
      needsCreditCard: false,
      isTrending: true,
      isLimitedTime: false,
    },
    {
      title: 'Mistral AI La Plateforme: 5M Free Tokens for New Developers',
      slug: 'mistral-free-tokens',
      shortDescription: '5M free tokens for Mistral Large, Codestral & Pixtral',
      fullDescription: 'Mistral AI provides 5 million free tokens to developers exploring La Plateforme. Build with Mistral Large 2, Codestral for programming, and Pixtral for vision.',
      dealType: 'credit',
      discountAmount: '5,000,000 Tokens Free',
      brandName: 'Mistral AI',
      brandWebsite: 'https://mistral.ai',
      topicSlug: 'ai',
      claimUrl: 'https://console.mistral.ai',
      howToClaim: [
        'Register at console.mistral.ai',
        'Verify your mobile number and organization details',
        'Activate promotional evaluation credits from dashboard',
      ],
      keyBenefits: [
        'State-of-the-art open-weights frontier models via fast API',
        'Codestral endpoint optimized specifically for code completion',
        'Multilingual support including European and Asian languages',
      ],
      eligibility: [
        'New developer console accounts',
      ],
      isStudentDeal: false,
      isStartupDeal: true,
      needsCreditCard: false,
      isTrending: false,
      isLimitedTime: false,
    },
    {
      title: 'Hugging Face Pro: 50% Student Discount for ML Researchers',
      slug: 'huggingface-student',
      shortDescription: '50% off Hugging Face Pro for students and researchers',
      fullDescription: 'Students and academic researchers can access Hugging Face Pro at 50% discount. Includes priority GPU compute, higher inference limits, and zero-GPU quotas.',
      dealType: 'discount',
      discountAmount: '50% Off Monthly Plan',
      brandName: 'Hugging Face',
      brandWebsite: 'https://huggingface.co',
      topicSlug: 'ai',
      claimUrl: 'https://huggingface.co/pricing',
      howToClaim: [
        'Log in to your Hugging Face account',
        'Go to Settings > Billing and select Student Verification',
        'Upload proof of academic enrollment or connect school email',
        '50% discount applies immediately to Pro billing',
      ],
      keyBenefits: [
        'Higher ZeroGPU compute limits for Space deployments',
        'Early access to experimental open source models',
        'Custom subdomains for Spaces showcase',
      ],
      eligibility: [
        'Active college, university, or high school student',
      ],
      isStudentDeal: true,
      isStartupDeal: false,
      needsCreditCard: true,
      isTrending: false,
      isLimitedTime: false,
    },
  ];

  return discoveryPool;
}
