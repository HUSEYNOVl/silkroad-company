import type {MetadataRoute} from 'next';
import {locales} from '@/lib/navigation';

const routes = [
  '',
  '/services',
  '/services/product-sourcing',
  '/services/factory-verification',
  '/services/oem-private-label',
  '/services/quality-inspection',
  '/services/consolidation',
  '/services/shipping',
  '/how-it-works',
  '/categories',
  '/categories/electronics',
  '/categories/home-goods',
  '/categories/beauty',
  '/categories/fashion',
  '/case-studies',
  '/case-studies/packaging-baku',
  '/case-studies/electronics-istanbul',
  '/case-studies/oem-dubai',
  '/about',
  '/blog',
  '/blog/china-sourcing-checklist',
  '/blog/factory-verification-guide',
  '/blog/shipping-from-china',
  '/quote',
  '/contact',
  '/privacy',
  '/terms'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.flatMap((locale) =>
    routes.map((route) => {
      const prefix = `/${locale}`;
      return {
        url: `https://sarkhan.com${prefix}${route}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8
      };
    })
  );
}
