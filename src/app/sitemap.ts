import type { MetadataRoute } from 'next';

const BASE_URL = 'https://goldenkey.website';

const STATIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/instructions',
  '/privacy',
  '/terms',
  '/legal',
  '/api-access',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
