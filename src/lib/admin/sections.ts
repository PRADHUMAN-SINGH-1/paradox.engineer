/**
 * Topic and Dashboard Section Mappings
 * Maps individual topic categories into top-level dashboard sections
 * and provides routing helpers for 1-click deal ingestion and community submissions.
 */

export interface DashboardSection {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export const DASHBOARD_SECTIONS: readonly DashboardSection[] = [
  { id: 'all', label: 'All Deals', icon: '📁', description: 'Complete catalog of all perks' },
  { id: 'cloud', label: 'Cloud & Hosting', icon: '☁️', description: 'Infrastructure, VPS, Databases, and CDN' },
  { id: 'ai', label: 'AI Tools & Models', icon: '🤖', description: 'LLM APIs, AI coding assistants, and media generators' },
  { id: 'devtools', label: 'Dev Tools & IDEs', icon: '💻', description: 'Developer productivity, IDEs, and CLI tools' },
  { id: 'student', label: 'Student Perks', icon: '🎓', description: 'Exclusive discounts verified for .edu students' },
  { id: 'startups', label: 'Startup Perks', icon: '🚀', description: 'High-value accelerator & incubator credits' },
  { id: 'freebies', label: 'Freebies & Trials', icon: '🆓', description: 'Zero cost perks and no credit-card required' },
  { id: 'productivity', label: 'Productivity & Ops', icon: '📝', description: 'Office suites, project management, and CRM' },
] as const;

export const TOPIC_SECTION_MAP: Record<string, { label: string; icon: string; sectionId: string }> = {
  'cloud-storage': { label: 'Cloud Storage & Databases', icon: '☁️', sectionId: 'cloud' },
  'hosting-domains': { label: 'Domains & Web Hosting', icon: '🌐', sectionId: 'cloud' },
  'ai': { label: 'AI Tools & Platforms', icon: '🤖', sectionId: 'ai' },
  'ai-media': { label: 'AI Media & Generators', icon: '🎨', sectionId: 'ai' },
  'vibe-coding': { label: 'Vibe Coding & Dev Tools', icon: '💻', sectionId: 'devtools' },
  'courses-and-certifications': { label: 'Learning & Certifications', icon: '🎓', sectionId: 'student' },
  'productivity': { label: 'Productivity & Docs', icon: '📝', sectionId: 'productivity' },
  'productivity-and-docs': { label: 'Productivity & Docs', icon: '📝', sectionId: 'productivity' },
  'creative': { label: 'Design & Creative', icon: '🎭', sectionId: 'creative' },
  'sales-and-crm': { label: 'Marketing, Sales & CRM', icon: '📈', sectionId: 'business' },
  'analytics-and-product': { label: 'Analytics & Product', icon: '📊', sectionId: 'business' },
  'legal-hr-ops': { label: 'Legal, Finance & Ops', icon: '⚖️', sectionId: 'business' },
  'entertainment': { label: 'Media & Entertainment', icon: '🎬', sectionId: 'entertainment' },
};

/**
 * Determines the primary dashboard hub section for any given deal item.
 * Evaluates priority in order: Student -> Startup -> Freebie/No-CC -> Topic Category.
 */
export function getDealTargetSection(deal: {
  topicSlug?: string;
  topic?: { slug?: string };
  isStudentDeal?: boolean;
  isStartupDeal?: boolean;
  dealType?: string;
  needsCreditCard?: boolean;
}): { label: string; icon: string; sectionId: string } {
  if (deal.isStudentDeal) {
    return { label: 'Student Deals', icon: '🎓', sectionId: 'student' };
  }
  if (deal.isStartupDeal) {
    return { label: 'Startup Perks', icon: '🚀', sectionId: 'startups' };
  }
  if (deal.dealType === 'freebie' || deal.needsCreditCard === false) {
    return { label: 'Freebies & No-CC', icon: '🆓', sectionId: 'freebies' };
  }

  const slug = deal.topicSlug || deal.topic?.slug || '';
  if (TOPIC_SECTION_MAP[slug]) {
    return TOPIC_SECTION_MAP[slug];
  }
  if (slug.includes('cloud')) {
    return { label: 'Cloud Storage & Databases', icon: '☁️', sectionId: 'cloud' };
  }
  if (slug.includes('ai')) {
    return { label: 'AI Tools & Platforms', icon: '🤖', sectionId: 'ai' };
  }

  return { label: 'Vibe Coding & Dev Tools', icon: '💻', sectionId: 'devtools' };
}
