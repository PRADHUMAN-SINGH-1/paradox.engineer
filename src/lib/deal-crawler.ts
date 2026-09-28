import { DISCOVERY_CANDIDATES, type ScrapedDeal } from '@/lib/crawler/candidates';

export type { ScrapedDeal };

/**
 * Intelligent Deal Discovery Engine
 * Scans, aggregates, and prepares high-value verified developer perks,
 * cloud infrastructure credits, AI token grants, and redeem-code programs.
 *
 * @returns {Promise<ScrapedDeal[]>} List of candidate deals discovered from verified programs.
 */
export async function fetchDiscoveredDeals(): Promise<ScrapedDeal[]> {
  // In a future extension, this engine can integrate with headless browser scrapers
  // or partner RSS feeds. Currently returns verified curated candidates.
  return Promise.resolve([...DISCOVERY_CANDIDATES]);
}
