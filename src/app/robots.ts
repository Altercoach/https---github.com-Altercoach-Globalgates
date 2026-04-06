import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/myoffice/', '/dashboard/'],
    },
    sitemap: 'https://goldenkey.website/sitemap.xml',
    host: 'https://goldenkey.website',
  };
}
