import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create Topics
  const topics = await Promise.all([
    prisma.topic.create({ data: { name: 'AI Tools & Platforms', slug: 'ai', icon: '🤖' } }),
    prisma.topic.create({ data: { name: 'Domains & Web Hosting', slug: 'hosting-domains', icon: '🌐' } }),
    prisma.topic.create({ data: { name: 'Productivity & Docs', slug: 'productivity-and-docs', icon: '📝' } }),
    prisma.topic.create({ data: { name: 'Vibe Coding & Dev Tools', slug: 'vibe-coding', icon: '💻' } }),
    prisma.topic.create({ data: { name: 'AI Media & Generators', slug: 'ai-media', icon: '🎨' } }),
    prisma.topic.create({ data: { name: 'Analytics & Product', slug: 'analytics-and-product', icon: '📊' } }),
    prisma.topic.create({ data: { name: 'Design & Creative', slug: 'creative', icon: '🎭' } }),
    prisma.topic.create({ data: { name: 'Cloud Storage & Databases', slug: 'cloud-storage', icon: '☁️' } }),
    prisma.topic.create({ data: { name: 'Marketing, Sales & CRM', slug: 'sales-and-crm', icon: '📈' } }),
    prisma.topic.create({ data: { name: 'Media & Entertainment', slug: 'entertainment', icon: '🎬' } }),
    prisma.topic.create({ data: { name: 'Learning & Certifications', slug: 'courses-and-certifications', icon: '🎓' } }),
    prisma.topic.create({ data: { name: 'Legal, Finance & Ops', slug: 'legal-hr-ops', icon: '⚖️' } }),
  ])

  const [ai, hosting, productivity, devTools, aiMedia, analytics, creative, cloud, crm, entertainment, learning, legal] = topics

  // Create Brands
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Anthropic', slug: 'anthropic', logoUrl: null, website: 'https://anthropic.com' } }),
    prisma.brand.create({ data: { name: 'OpenAI', slug: 'openai', logoUrl: null, website: 'https://openai.com' } }),
    prisma.brand.create({ data: { name: 'Google', slug: 'google', logoUrl: null, website: 'https://google.com' } }),
    prisma.brand.create({ data: { name: 'Adobe', slug: 'adobe', logoUrl: null, website: 'https://adobe.com' } }),
    prisma.brand.create({ data: { name: 'Cloudways', slug: 'cloudways', logoUrl: null, website: 'https://cloudways.com' } }),
    prisma.brand.create({ data: { name: 'Vercel', slug: 'vercel', logoUrl: null, website: 'https://vercel.com' } }),
    prisma.brand.create({ data: { name: 'AWS', slug: 'aws', logoUrl: null, website: 'https://aws.amazon.com' } }),
    prisma.brand.create({ data: { name: 'Spotify', slug: 'spotify', logoUrl: null, website: 'https://spotify.com' } }),
    prisma.brand.create({ data: { name: 'YouTube', slug: 'youtube', logoUrl: null, website: 'https://youtube.com' } }),
    prisma.brand.create({ data: { name: 'Replit', slug: 'replit', logoUrl: null, website: 'https://replit.com' } }),
    prisma.brand.create({ data: { name: 'Bolt.new', slug: 'bolt-new', logoUrl: null, website: 'https://bolt.new' } }),
    prisma.brand.create({ data: { name: 'Lovable', slug: 'lovable', logoUrl: null, website: 'https://lovable.dev' } }),
    prisma.brand.create({ data: { name: 'xAI', slug: 'xai', logoUrl: null, website: 'https://x.ai' } }),
    prisma.brand.create({ data: { name: 'Meta', slug: 'meta', logoUrl: null, website: 'https://meta.com' } }),
    prisma.brand.create({ data: { name: 'Miro', slug: 'miro', logoUrl: null, website: 'https://miro.com' } }),
    prisma.brand.create({ data: { name: 'Civo', slug: 'civo', logoUrl: null, website: 'https://civo.com' } }),
    prisma.brand.create({ data: { name: 'Apple', slug: 'apple', logoUrl: null, website: 'https://apple.com' } }),
    prisma.brand.create({ data: { name: 'PixVerse', slug: 'pixverse', logoUrl: null, website: 'https://pixverse.ai' } }),
    prisma.brand.create({ data: { name: 'Notion', slug: 'notion', logoUrl: null, website: 'https://notion.so' } }),
    prisma.brand.create({ data: { name: 'GitHub', slug: 'github', logoUrl: null, website: 'https://github.com' } }),
    prisma.brand.create({ data: { name: 'Vultr', slug: 'vultr', logoUrl: null, website: 'https://vultr.com' } }),
    prisma.brand.create({ data: { name: 'DigitalOcean', slug: 'digitalocean', logoUrl: null, website: 'https://digitalocean.com' } }),
    prisma.brand.create({ data: { name: 'Figma', slug: 'figma', logoUrl: null, website: 'https://figma.com' } }),
    prisma.brand.create({ data: { name: 'Canva', slug: 'canva', logoUrl: null, website: 'https://canva.com' } }),
    prisma.brand.create({ data: { name: 'Discord', slug: 'discord', logoUrl: null, website: 'https://discord.com' } }),
  ])

  const [anthropic, openai, google, adobe, cloudways, vercel, aws, spotify, youtube, replit, boltNew, lovable, xai, meta, miro, civo, apple, pixverse, notion, github, vultr, digitalocean, figma, canva, discord] = brands

  // Create Deals
  await Promise.all([
    // AI Deals
    prisma.deal.create({
      data: {
        title: 'Claude Code $100 - $250 Free Credits + Student Discount',
        slug: 'claude-credits',
        shortDescription: 'Up to $250 credits for Claude Code cloud sessions',
        fullDescription: 'Existing Claude Pro subscribers can claim a one-time $100 credit, while existing Max subscribers can claim $250. The promotional balance is separate from normal Claude usage limits and is automatically used when you start an eligible Claude Code cloud session.',
        dealType: 'credit',
        discountAmount: 'Up to $250 credits',
        claimUrl: 'https://claude.ai/code/claim-credit/10',
        howToClaim: JSON.stringify([
          'Open the official Claude Code credit claim page while signed into eligible Pro or Max account',
          'Claim the promotional credit or run /claim-credit in Claude Code CLI',
          'Connect GitHub and choose a repository',
          'Start a Claude Code cloud session — credit applies automatically'
        ]),
        keyBenefits: JSON.stringify([
          '$100 promotional cloud-session credit for existing Pro subscribers',
          '$250 promotional cloud-session credit for existing Max subscribers',
          'Credit is separate from normal plan usage limits',
          'Cloud tasks can continue running after laptop is closed',
        ]),
        eligibility: JSON.stringify([
          'Must be an existing Claude Pro or Max subscriber',
          'GitHub must be connected to start cloud-session workflow',
          'One promotional credit per account',
        ]),
        isStudentDeal: true,
        needsCreditCard: false,
        isTrending: true,
        clickCount: 25300,
        viewCount: 45000,
        brandId: anthropic.id,
        topicId: ai.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'ChatGPT Free Trial: 3, 6 and 12 Month Plans',
        slug: 'chatgpt-free-trial',
        shortDescription: '1, 3, 6 and 12 months of ChatGPT trial',
        fullDescription: 'Get extended free trial access to ChatGPT Plus with various trial period options. Access GPT-4, DALL·E, and advanced features without paying.',
        dealType: 'trial',
        discountAmount: '1-12 months free',
        claimUrl: 'https://chat.openai.com',
        howToClaim: JSON.stringify([
          'Visit the official ChatGPT website',
          'Create a new account or sign in',
          'Navigate to subscription settings',
          'Look for active trial promotions',
        ]),
        keyBenefits: JSON.stringify([
          'Access to GPT-4 and latest models',
          'DALL·E image generation included',
          'Advanced data analysis features',
          'Priority access during peak times',
        ]),
        eligibility: JSON.stringify([
          'New users or eligible returning users',
          'Valid email address required',
          'Some trials may require credit card',
        ]),
        isTrending: true,
        clickCount: 89900,
        viewCount: 120000,
        brandId: openai.id,
        topicId: ai.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Gemini Student Discount: 1 Year Free AI Pro Plan',
        slug: 'gemini-student',
        shortDescription: '12 months free + up to 75% off',
        fullDescription: 'Students with a verified .edu email can claim 1 year of Gemini Advanced for free. Get access to Google\'s most capable AI model, Gems, and 2TB of storage.',
        dealType: 'discount',
        discountAmount: '1 year free',
        claimUrl: 'https://gemini.google.com/advanced',
        howToClaim: JSON.stringify([
          'Go to Google Gemini Advanced page',
          'Click "Try for free" or student offer',
          'Sign in with your Google account linked to .edu email',
          'Verify student status through SheerID or similar',
        ]),
        keyBenefits: JSON.stringify([
          '12 months of Gemini Advanced completely free',
          'Access to Google\'s latest AI models',
          '2TB Google One storage included',
          'Priority access to new features',
        ]),
        eligibility: JSON.stringify([
          'Must have a valid .edu email address',
          'Student status verification required',
          'One claim per student account',
        ]),
        isStudentDeal: true,
        isTrending: true,
        clickCount: 21200,
        viewCount: 50000,
        brandId: google.id,
        topicId: ai.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Grok Bot Free Trial: 7 Days + Free with SuperGrok',
        slug: 'grok-free-trial',
        shortDescription: 'Free 7-day Grok Bot trial',
        fullDescription: 'Try xAI\'s Grok chatbot for free with a 7-day trial. Access advanced reasoning, real-time X/Twitter data, and image generation capabilities.',
        dealType: 'trial',
        discountAmount: '7 days free',
        claimUrl: 'https://grok.x.ai',
        howToClaim: JSON.stringify([
          'Visit grok.x.ai or open the X app',
          'Sign in with your X/Twitter account',
          'Start the free trial from the subscription page',
          'Use Grok for 7 days at no cost',
        ]),
        keyBenefits: JSON.stringify([
          '7-day free trial of Grok Premium',
          'Real-time data from X/Twitter',
          'Image generation with Aurora',
          'Advanced reasoning capabilities',
        ]),
        eligibility: JSON.stringify([
          'X/Twitter account required',
          'New trial users only',
          'Credit card required for trial activation',
        ]),
        needsCreditCard: true,
        clickCount: 6800,
        viewCount: 15000,
        brandId: xai.id,
        topicId: ai.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Meta Muse AI Referral Code – 1B Free Tokens',
        slug: 'meta-muse-ai',
        shortDescription: '1B Muse tokens + free usage tier',
        fullDescription: 'Use Meta Muse AI referral code to claim 1 billion free tokens instantly. Access Meta\'s AI image and video generation platform with generous free tier.',
        dealType: 'freebie',
        discountAmount: '1B free tokens',
        claimUrl: 'https://muse.meta.com',
        howToClaim: JSON.stringify([
          'Visit Meta Muse AI platform',
          'Create a new account',
          'Enter the referral code during signup',
          'Tokens are credited instantly to your account',
        ]),
        keyBenefits: JSON.stringify([
          '1 billion free generation tokens',
          'AI image generation included',
          'Video generation capabilities',
          'No credit card needed',
        ]),
        eligibility: JSON.stringify([
          'New Meta Muse AI accounts only',
          'Valid email required',
          'Referral code must be entered at signup',
        ]),
        needsCreditCard: false,
        isTrending: true,
        isLimitedTime: true,
        clickCount: 5600,
        viewCount: 12000,
        brandId: meta.id,
        topicId: ai.id,
      }
    }),

    // Developer Tools Deals
    prisma.deal.create({
      data: {
        title: 'Lovable Promo Code: Student Discount + 1 Year Free',
        slug: 'lovable-promo',
        shortDescription: '50% off for students + 20% Off',
        fullDescription: 'Get the Lovable AI app builder at 50% off with student verification, or use promo codes for 20% off regular plans. Build full-stack web apps with AI assistance.',
        dealType: 'discount',
        discountAmount: '50% off students',
        claimUrl: 'https://lovable.dev',
        howToClaim: JSON.stringify([
          'Visit lovable.dev and create an account',
          'Go to the pricing/subscription page',
          'Apply student verification or promo code at checkout',
          'Discount is applied to your subscription',
        ]),
        keyBenefits: JSON.stringify([
          '50% discount for verified students',
          'AI-powered full-stack app building',
          'Deploy directly from the platform',
          'GitHub integration included',
        ]),
        eligibility: JSON.stringify([
          'Student verification required for 50% off',
          '.edu email or student ID needed',
          'Regular promo codes available for non-students',
        ]),
        isStudentDeal: true,
        isTrending: true,
        isLimitedTime: true,
        clickCount: 33500,
        viewCount: 60000,
        brandId: lovable.id,
        topicId: devTools.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Bolt.new Free Tokens (1M) + 20% Discount for 3 Months',
        slug: 'bolt-new-discount',
        shortDescription: '20% discount for 3 months',
        fullDescription: 'Save 20% on your Bolt.new subscription for the first 3 months using exclusive referral link. Build and deploy full-stack web apps with AI.',
        dealType: 'discount',
        discountAmount: '20% off 3 months',
        claimUrl: 'https://bolt.new',
        howToClaim: JSON.stringify([
          'Click the referral link to visit Bolt.new',
          'Create a new account or sign in',
          'Choose your subscription plan',
          '20% discount applies automatically for 3 months',
        ]),
        keyBenefits: JSON.stringify([
          '1 million free tokens on signup',
          '20% off for first 3 months',
          'AI-powered full-stack development',
          'Instant deployment included',
        ]),
        eligibility: JSON.stringify([
          'New or existing Bolt.new users',
          'Must use referral link for discount',
          'Discount applies to paid plans only',
        ]),
        needsCreditCard: true,
        clickCount: 19200,
        viewCount: 35000,
        brandId: boltNew.id,
        topicId: devTools.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Replit Student Discount: 50% Off Core + $20 Referral',
        slug: 'replit-student',
        shortDescription: '50% student discount on Core plan',
        fullDescription: 'Replit offers 50% off Core plan for verified students and a $20 referral credit program. Code, build, and deploy from anywhere with AI assistance.',
        dealType: 'discount',
        discountAmount: '50% off Core',
        claimUrl: 'https://replit.com',
        howToClaim: JSON.stringify([
          'Visit replit.com and sign up with your .edu email',
          'Navigate to the pricing page',
          'Verify your student status',
          'Core plan is automatically discounted to $10/month',
        ]),
        keyBenefits: JSON.stringify([
          'Core plan at $10/month instead of $20/month',
          '$20 referral credit for inviting friends',
          'AI-powered code completion',
          'Cloud development environment',
        ]),
        eligibility: JSON.stringify([
          'Valid .edu email required',
          'Student status must be verified',
          'New subscribers to Core plan',
        ]),
        isStudentDeal: true,
        needsCreditCard: true,
        clickCount: 6500,
        viewCount: 18000,
        brandId: replit.id,
        topicId: devTools.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'GitHub Student Developer Pack: Free Pro + 50+ Tools',
        slug: 'github-student-pack',
        shortDescription: 'Free GitHub Pro + 50+ dev tools',
        fullDescription: 'GitHub\'s Student Developer Pack gives verified students free access to GitHub Pro and over 50 developer tools including cloud credits, domains, and CI/CD tools.',
        dealType: 'freebie',
        discountAmount: '50+ free tools',
        claimUrl: 'https://education.github.com/pack',
        howToClaim: JSON.stringify([
          'Visit education.github.com/pack',
          'Click "Get your pack"',
          'Verify your student status with school email or student ID',
          'Access all included tools and benefits',
        ]),
        keyBenefits: JSON.stringify([
          'Free GitHub Pro account',
          '50+ partner tools included',
          'Free domain names',
          'Cloud credits from multiple providers',
        ]),
        eligibility: JSON.stringify([
          'Must be a current student (13+ years old)',
          'Student verification required',
          '.edu email or student ID photo needed',
        ]),
        isStudentDeal: true,
        needsCreditCard: false,
        isTrending: true,
        clickCount: 45000,
        viewCount: 95000,
        brandId: github.id,
        topicId: devTools.id,
      }
    }),

    // Hosting Deals
    prisma.deal.create({
      data: {
        title: 'Cloudways Hosting 40% Off for 3 Months',
        slug: 'cloudways-discount',
        shortDescription: '40% off managed cloud hosting',
        fullDescription: 'Get 40% off Cloudways managed cloud hosting for your first 3 months. Choose from DigitalOcean, AWS, or Google Cloud infrastructure with managed support.',
        dealType: 'discount',
        discountAmount: '40% off 3 months',
        claimUrl: 'https://cloudways.com',
        howToClaim: JSON.stringify([
          'Visit Cloudways website through the deal link',
          'Sign up for a new account',
          'Choose your cloud provider and server size',
          'Promo code is auto-applied at checkout',
        ]),
        keyBenefits: JSON.stringify([
          '40% discount on first 3 months',
          'Managed cloud hosting — no server admin needed',
          'Free SSL, CDN, and migrations',
          'Choose from 5 cloud providers',
        ]),
        eligibility: JSON.stringify([
          'New Cloudways customers only',
          'Valid for all server plans',
          'Credit card required at signup',
        ]),
        needsCreditCard: true,
        clickCount: 8500,
        viewCount: 20000,
        brandId: cloudways.id,
        topicId: hosting.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'AWS Free Tier: Get Up to $200 in Cloud Credits',
        slug: 'aws-free-credits',
        shortDescription: 'Up to $200 in AWS cloud credits',
        fullDescription: 'New AWS customers get $100 in credits at signup and can earn another $100 by completing eligible activities, for up to $200 total. Free tier runs up to 6 months.',
        dealType: 'credit',
        discountAmount: 'Up to $200 credits',
        claimUrl: 'https://aws.amazon.com/free',
        howToClaim: JSON.stringify([
          'Visit AWS Free Tier page',
          'Create a new AWS account',
          'Complete identity verification',
          'Credits are automatically applied to your account',
        ]),
        keyBenefits: JSON.stringify([
          '$100 credits at signup',
          'Earn additional $100 through activities',
          '6-month free tier access',
          '750 hours of EC2 included',
        ]),
        eligibility: JSON.stringify([
          'New AWS customers only',
          'Credit card required for verification',
          'Credits expire 12 months after creation',
        ]),
        needsCreditCard: true,
        clickCount: 2300,
        viewCount: 8000,
        brandId: aws.id,
        topicId: hosting.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Civo Cloud $250 Free Credit for New Users',
        slug: 'civo-free-credits',
        shortDescription: '$250 free cloud credits',
        fullDescription: 'Get $250 in free cloud credits when you sign up for Civo Cloud. Deploy Kubernetes clusters, VMs, and managed databases on their lightning-fast platform.',
        dealType: 'credit',
        discountAmount: '$250 free credits',
        claimUrl: 'https://civo.com',
        howToClaim: JSON.stringify([
          'Visit Civo Cloud website',
          'Create a new account',
          'Verify your email address',
          '$250 credit is applied automatically for 30 days',
        ]),
        keyBenefits: JSON.stringify([
          '$250 free credit to try any service',
          'Lightning-fast Kubernetes deployment',
          'Simple, transparent pricing after credits',
          'Managed databases available',
        ]),
        eligibility: JSON.stringify([
          'New Civo accounts only',
          'Credit valid for 30 days',
          'Credit card may be required',
        ]),
        isTrending: true,
        needsCreditCard: true,
        clickCount: 3200,
        viewCount: 7000,
        brandId: civo.id,
        topicId: hosting.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Vultr $250 Free Cloud Credits for New Users',
        slug: 'vultr-free-credits',
        shortDescription: '$250 in free cloud compute credits',
        fullDescription: 'Sign up for Vultr and get $250 in free credits to deploy cloud compute, bare metal, and GPU instances. Credits valid for 30 days.',
        dealType: 'credit',
        discountAmount: '$250 credits',
        claimUrl: 'https://vultr.com',
        howToClaim: JSON.stringify([
          'Click the referral link to visit Vultr',
          'Create a new account',
          'Add a payment method for verification',
          '$250 credit applied automatically',
        ]),
        keyBenefits: JSON.stringify([
          '$250 free credits for 30 days',
          'Cloud compute, bare metal, GPU available',
          '32 global data center locations',
          'One-click app deployments',
        ]),
        eligibility: JSON.stringify([
          'New Vultr accounts only',
          'Payment method required for verification',
          'Credits expire after 30 days',
        ]),
        needsCreditCard: true,
        clickCount: 4100,
        viewCount: 9500,
        brandId: vultr.id,
        topicId: hosting.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'DigitalOcean $200 Free Credits for 60 Days',
        slug: 'digitalocean-credits',
        shortDescription: '$200 in free cloud credits',
        fullDescription: 'New DigitalOcean users get $200 in free credits valid for 60 days. Deploy droplets, Kubernetes, databases, and app platform services.',
        dealType: 'credit',
        discountAmount: '$200 credits',
        claimUrl: 'https://digitalocean.com',
        howToClaim: JSON.stringify([
          'Sign up through the referral link',
          'Add a payment method ($5 hold)',
          '$200 credit is applied to your account',
          'Use within 60 days on any service',
        ]),
        keyBenefits: JSON.stringify([
          '$200 free credits valid for 60 days',
          'Simple, developer-friendly cloud',
          'Managed Kubernetes, databases available',
          'App Platform for easy deployments',
        ]),
        eligibility: JSON.stringify([
          'New DigitalOcean accounts only',
          'Payment method with $5 authorization required',
          'Credits expire after 60 days',
        ]),
        needsCreditCard: true,
        clickCount: 5600,
        viewCount: 12000,
        brandId: digitalocean.id,
        topicId: hosting.id,
      }
    }),

    // Entertainment Deals
    prisma.deal.create({
      data: {
        title: 'Spotify 3 Months Free Premium + Student Discount',
        slug: 'spotify-premium',
        shortDescription: '3 months free + student offers',
        fullDescription: 'Get 3 months of Spotify Premium Individual for $0 through active US referral offer. Students can claim separate Premium Student offers with country-specific pricing.',
        dealType: 'trial',
        discountAmount: '3 months free',
        claimUrl: 'https://spotify.com/premium',
        howToClaim: JSON.stringify([
          'Visit Spotify Premium page',
          'Click "Get 3 months free"',
          'Create account or sign in',
          'Start your free trial period',
        ]),
        keyBenefits: JSON.stringify([
          '3 months of Premium completely free',
          'Ad-free music streaming',
          'Offline downloads',
          'High-quality audio',
        ]),
        eligibility: JSON.stringify([
          'New Premium subscribers only',
          'Returning users may be eligible',
          'Credit card required',
        ]),
        isStudentDeal: true,
        isLimitedTime: true,
        needsCreditCard: true,
        isTrending: true,
        clickCount: 12000,
        viewCount: 30000,
        brandId: spotify.id,
        topicId: entertainment.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'YouTube Premium Free Trial: 3, 6, 12 Months + Student Deal',
        slug: 'youtube-premium',
        shortDescription: '75% Off YouTube Premium',
        fullDescription: 'Get YouTube Premium with extended free trials and student discounts. Watch ad-free, download videos, and get YouTube Music included.',
        dealType: 'discount',
        discountAmount: '75% off',
        claimUrl: 'https://youtube.com/premium',
        howToClaim: JSON.stringify([
          'Visit youtube.com/premium',
          'Sign in with your Google account',
          'Select trial or student plan',
          'Complete payment setup',
        ]),
        keyBenefits: JSON.stringify([
          'Ad-free YouTube viewing',
          'Background play on mobile',
          'YouTube Music Premium included',
          'Video downloads for offline viewing',
        ]),
        eligibility: JSON.stringify([
          'New Premium subscribers for free trial',
          'Students need .edu email verification',
          'Available in select countries',
        ]),
        isStudentDeal: true,
        clickCount: 22900,
        viewCount: 55000,
        brandId: youtube.id,
        topicId: entertainment.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Apple One 3 Months Free Trial with New Device',
        slug: 'apple-one-trial',
        shortDescription: '3 months free Apple One trial',
        fullDescription: 'Get 3 months of Apple One free when you purchase a new Apple device. Includes Apple Music, TV+, Arcade, iCloud+, and more services bundled together.',
        dealType: 'trial',
        discountAmount: '3 months free',
        claimUrl: 'https://apple.com/apple-one',
        howToClaim: JSON.stringify([
          'Purchase a new Apple device (iPhone, iPad, Mac, etc.)',
          'Open the Apple One or Apple Music app on your new device',
          'You\'ll see a redemption offer for 3 months free',
          'Accept the trial — no payment during trial period',
        ]),
        keyBenefits: JSON.stringify([
          'Apple Music included',
          'Apple TV+ streaming included',
          'Apple Arcade games included',
          '50GB+ iCloud storage included',
        ]),
        eligibility: JSON.stringify([
          'Must purchase a new qualifying Apple device',
          'One redemption per device',
          'Must be redeemed within 90 days of device activation',
        ]),
        isLimitedTime: true,
        isTrending: true,
        needsCreditCard: false,
        clickCount: 8400,
        viewCount: 18000,
        brandId: apple.id,
        topicId: entertainment.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Discord Nitro Free Trial: 1 Month Free',
        slug: 'discord-nitro',
        shortDescription: '1 month free Discord Nitro',
        fullDescription: 'Get 1 month of Discord Nitro for free. Unlock custom emojis everywhere, HD video streaming, bigger file uploads, and server boosts.',
        dealType: 'trial',
        discountAmount: '1 month free',
        claimUrl: 'https://discord.com/nitro',
        howToClaim: JSON.stringify([
          'Open Discord app or visit discord.com/nitro',
          'Sign in to your Discord account',
          'Look for the free trial promotion',
          'Activate Nitro — cancel before trial ends to avoid charges',
        ]),
        keyBenefits: JSON.stringify([
          'Custom emojis across all servers',
          'HD video streaming (up to 4K)',
          'Larger file uploads (500MB)',
          '2 server boosts included',
        ]),
        eligibility: JSON.stringify([
          'Discord account required',
          'New Nitro subscribers or eligible returning users',
          'Credit card required for trial',
        ]),
        needsCreditCard: true,
        clickCount: 7200,
        viewCount: 16000,
        brandId: discord.id,
        topicId: entertainment.id,
      }
    }),

    // Productivity Deals
    prisma.deal.create({
      data: {
        title: 'Google Workspace 14% OFF Annual Plans',
        slug: 'google-workspace',
        shortDescription: '14% off Google Workspace plans',
        fullDescription: 'Save 14% on Google Workspace annual plans. Get professional Gmail, Drive, Docs, Sheets, and Meet with custom domain for your business or team.',
        dealType: 'promo-code',
        discountAmount: '14% off',
        claimUrl: 'https://workspace.google.com',
        howToClaim: JSON.stringify([
          'Visit Google Workspace pricing page',
          'Choose Business Starter, Standard, or Plus',
          'Select annual billing',
          'Apply promo code at checkout',
        ]),
        keyBenefits: JSON.stringify([
          '14% off annual subscription',
          'Professional email with custom domain',
          'Generous cloud storage (30GB to 5TB)',
          'Full Google Docs, Sheets, Slides suite',
        ]),
        eligibility: JSON.stringify([
          'New Google Workspace subscribers',
          'Annual billing plans only',
          'All business plan tiers eligible',
        ]),
        needsCreditCard: true,
        clickCount: 3800,
        viewCount: 9000,
        brandId: google.id,
        topicId: productivity.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Notion Free for Students & Educators',
        slug: 'notion-student',
        shortDescription: 'Free Notion Plus plan for students',
        fullDescription: 'Students and educators get Notion Plus plan completely free. Organize your notes, projects, and assignments with unlimited blocks and file uploads.',
        dealType: 'freebie',
        discountAmount: 'Free Plus plan',
        claimUrl: 'https://notion.so/students',
        howToClaim: JSON.stringify([
          'Visit notion.so/students',
          'Sign up with your .edu email address',
          'Verify your student status',
          'Plus plan features are unlocked immediately',
        ]),
        keyBenefits: JSON.stringify([
          'Plus plan completely free (normally $10/month)',
          'Unlimited blocks and pages',
          'Unlimited file uploads',
          'Version history for 30 days',
        ]),
        eligibility: JSON.stringify([
          'Must have a valid .edu email',
          'Students and educators qualify',
          'Renews annually with re-verification',
        ]),
        isStudentDeal: true,
        needsCreditCard: false,
        clickCount: 15000,
        viewCount: 35000,
        brandId: notion.id,
        topicId: productivity.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Miro Startup Program: Up to $1,000 in Credits',
        slug: 'miro-startup',
        shortDescription: 'Up to $1,000 credits for startups',
        fullDescription: 'Miro\'s startup program offers up to $1,000 in credits for qualifying startups. Access infinite canvas, collaboration tools, and project management features.',
        dealType: 'credit',
        discountAmount: 'Up to $1,000 credits',
        claimUrl: 'https://miro.com/startups',
        howToClaim: JSON.stringify([
          'Visit Miro startup program page',
          'Apply with your startup details',
          'Get approved (usually within a week)',
          'Credits are applied to your Miro account',
        ]),
        keyBenefits: JSON.stringify([
          'Up to $1,000 in Miro credits',
          'Infinite collaborative canvas',
          'Project management templates',
          'Integration with 100+ tools',
        ]),
        eligibility: JSON.stringify([
          'Early-stage startups (founded < 5 years)',
          'Less than $10M in funding',
          'Must not be an existing paid Miro customer',
        ]),
        isStartupDeal: true,
        needsCreditCard: false,
        clickCount: 2100,
        viewCount: 5000,
        brandId: miro.id,
        topicId: productivity.id,
      }
    }),

    // Creative Deals
    prisma.deal.create({
      data: {
        title: 'Adobe Student Discount: Creative Cloud 60% Off',
        slug: 'adobe-student',
        shortDescription: '60% off Creative Cloud for students',
        fullDescription: 'Get the entire Adobe Creative Cloud suite at 60% off with student verification. Access Photoshop, Illustrator, Premiere Pro, After Effects, and 20+ apps.',
        dealType: 'discount',
        discountAmount: '60% off',
        claimUrl: 'https://adobe.com/creativecloud/plans.html',
        howToClaim: JSON.stringify([
          'Visit Adobe Creative Cloud pricing page',
          'Select the "Students & Teachers" plan',
          'Verify your student/educator status',
          'Subscribe at the discounted rate',
        ]),
        keyBenefits: JSON.stringify([
          '60% off Creative Cloud All Apps plan',
          '20+ creative apps including Photoshop, Illustrator',
          '100GB cloud storage included',
          'Adobe Fonts and Adobe Portfolio included',
        ]),
        eligibility: JSON.stringify([
          'Must be a student or educator',
          'Valid school enrollment verification',
          'Ages 13+ for individual plans',
        ]),
        isStudentDeal: true,
        isTrending: true,
        needsCreditCard: true,
        clickCount: 30100,
        viewCount: 50000,
        brandId: adobe.id,
        topicId: creative.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Figma Free Plan: Unlimited Design Files',
        slug: 'figma-free',
        shortDescription: 'Free Figma plan for individuals',
        fullDescription: 'Figma offers a generous free plan with unlimited personal files, 3 active projects, and collaboration features. Perfect for freelancers and students.',
        dealType: 'freebie',
        discountAmount: 'Free forever',
        claimUrl: 'https://figma.com',
        howToClaim: JSON.stringify([
          'Visit figma.com and click "Get started for free"',
          'Create your account with email or Google',
          'Start designing immediately',
          'No credit card required',
        ]),
        keyBenefits: JSON.stringify([
          'Unlimited personal design files',
          '3 active Figma and FigJam projects',
          'Real-time collaboration',
          'Dev mode access for developers',
        ]),
        eligibility: JSON.stringify([
          'Anyone can sign up',
          'No credit card required',
          'Free forever — not a trial',
        ]),
        needsCreditCard: false,
        clickCount: 12500,
        viewCount: 28000,
        brandId: figma.id,
        topicId: creative.id,
      }
    }),
    prisma.deal.create({
      data: {
        title: 'Canva Pro Free for Students & Teachers',
        slug: 'canva-education',
        shortDescription: 'Free Canva Pro for education',
        fullDescription: 'Canva for Education gives students and teachers free access to Canva Pro features including premium templates, brand kits, and AI-powered design tools.',
        dealType: 'freebie',
        discountAmount: 'Free Pro access',
        claimUrl: 'https://canva.com/education',
        howToClaim: JSON.stringify([
          'Visit canva.com/education',
          'Click "Get verified" as a teacher or student',
          'Submit your school credentials for verification',
          'Full Canva Pro access is unlocked',
        ]),
        keyBenefits: JSON.stringify([
          'Free Canva Pro (normally $13/month)',
          'Millions of premium templates',
          'Brand Kit and Magic Resize tools',
          'AI-powered design features',
        ]),
        eligibility: JSON.stringify([
          'K-12 teachers and students',
          'School email or credentials required',
          'Verification may take 24-48 hours',
        ]),
        isStudentDeal: true,
        needsCreditCard: false,
        clickCount: 18000,
        viewCount: 40000,
        brandId: canva.id,
        topicId: creative.id,
      }
    }),

    // AI Media Deals
    prisma.deal.create({
      data: {
        title: 'PixVerse AI Free Video Generation Credits',
        slug: 'pixverse-free',
        shortDescription: 'Free AI video generation credits',
        fullDescription: 'PixVerse offers free AI video generation credits for new users. Create stunning AI-generated videos from text prompts or images.',
        dealType: 'freebie',
        discountAmount: 'Free credits',
        claimUrl: 'https://pixverse.ai',
        howToClaim: JSON.stringify([
          'Visit pixverse.ai',
          'Create a free account',
          'Free credits are added to your account immediately',
          'Start creating AI videos from text or images',
        ]),
        keyBenefits: JSON.stringify([
          'Free video generation credits on signup',
          'Text-to-video AI generation',
          'Image-to-video conversion',
          'Multiple video styles available',
        ]),
        eligibility: JSON.stringify([
          'New PixVerse accounts',
          'No credit card required',
          'Available worldwide',
        ]),
        needsCreditCard: false,
        clickCount: 4500,
        viewCount: 10000,
        brandId: pixverse.id,
        topicId: aiMedia.id,
      }
    }),

    // Startup-specific Deals
    prisma.deal.create({
      data: {
        title: 'Vercel Startup Program: $5,000 in Credits',
        slug: 'vercel-startup',
        shortDescription: '$5,000 in Vercel credits for startups',
        fullDescription: 'Vercel\'s startup program provides $5,000 in credits for qualifying startups. Deploy Next.js apps with edge computing, analytics, and enterprise features.',
        dealType: 'credit',
        discountAmount: '$5,000 credits',
        claimUrl: 'https://vercel.com/startups',
        howToClaim: JSON.stringify([
          'Apply at vercel.com/startups',
          'Provide startup details and funding info',
          'Wait for approval (1-2 weeks)',
          'Credits are applied to your Vercel team',
        ]),
        keyBenefits: JSON.stringify([
          '$5,000 in Vercel credits',
          'Enterprise-grade edge network',
          'Advanced analytics included',
          'Priority support for startups',
        ]),
        eligibility: JSON.stringify([
          'Early-stage startups (Seed or Series A)',
          'Less than $5M in total funding',
          'Must not already be on an Enterprise plan',
        ]),
        isStartupDeal: true,
        needsCreditCard: false,
        clickCount: 3500,
        viewCount: 8000,
        brandId: vercel.id,
        topicId: hosting.id,
      }
    }),

    // Learning Deal
    prisma.deal.create({
      data: {
        title: 'Gemini Free Trial: 3 Months AI Pro with Coursera',
        slug: 'gemini-coursera',
        shortDescription: 'Up to 12-month Trial with Coursera',
        fullDescription: 'Get up to 3 months of Gemini Advanced free when you have an active Coursera paid subscription. Access Google\'s most capable AI for learning and research.',
        dealType: 'trial',
        discountAmount: '3 months free',
        claimUrl: 'https://gemini.google.com',
        howToClaim: JSON.stringify([
          'Have an active paid Coursera subscription',
          'Visit the Gemini promotion page',
          'Link your Google account',
          'Gemini Advanced activates for 3 months',
        ]),
        keyBenefits: JSON.stringify([
          '3 months of Gemini Advanced free',
          'Enhanced AI for learning and research',
          '2TB Google One storage',
          'Works alongside Coursera courses',
        ]),
        eligibility: JSON.stringify([
          'Active Coursera paid subscription required',
          'Google account needed',
          'New Gemini Advanced subscribers only',
        ]),
        needsCreditCard: false,
        isTrending: true,
        clickCount: 36400,
        viewCount: 70000,
        brandId: google.id,
        topicId: learning.id,
      }
    }),

    // ChatGPT Student Deal
    prisma.deal.create({
      data: {
        title: 'ChatGPT Student Discount: 4 Months Plus Plan (US)',
        slug: 'chatgpt-student',
        shortDescription: '4 months of ChatGPT Plus free for students',
        fullDescription: 'US students can get 4 months of ChatGPT Plus for free with a valid .edu email. Access GPT-4, DALL·E 3, and advanced features.',
        dealType: 'freebie',
        discountAmount: '4 months free',
        claimUrl: 'https://chat.openai.com',
        howToClaim: JSON.stringify([
          'Visit ChatGPT and sign in',
          'Go to Settings > Subscription',
          'Click "Student discount" option',
          'Verify with your .edu email address',
        ]),
        keyBenefits: JSON.stringify([
          '4 months of ChatGPT Plus completely free',
          'Access to GPT-4 and latest models',
          'DALL·E 3 image generation',
          'Advanced Data Analysis',
        ]),
        eligibility: JSON.stringify([
          'US students only',
          'Valid .edu email required',
          'One claim per student account',
        ]),
        isStudentDeal: true,
        needsCreditCard: false,
        isTrending: true,
        clickCount: 17900,
        viewCount: 42000,
        brandId: openai.id,
        topicId: ai.id,
      }
    }),
  ])

  console.log('✅ Database seeded with topics, brands, and deals!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
