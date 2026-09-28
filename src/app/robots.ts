import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://paradox.engineer';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/admin/',
          '/api/cron/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/api/admin/',
          '/api/cron/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
