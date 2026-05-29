import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'ru', 'tr', 'ar', 'az'] as const;
export const defaultLocale = 'en';
export const localePrefix = 'always';
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  tr: 'Türkçe',
  ar: 'العربية',
  az: 'Azərbaycanca'
};

export const pathnames = {
  '/': '/',
  '/services': '/services',
  '/services/product-sourcing': '/services/product-sourcing',
  '/services/factory-verification': '/services/factory-verification',
  '/services/oem-private-label': '/services/oem-private-label',
  '/services/quality-inspection': '/services/quality-inspection',
  '/services/consolidation': '/services/consolidation',
  '/services/shipping': '/services/shipping',
  '/how-it-works': '/how-it-works',
  '/process': '/process',
  '/categories': '/categories',
  '/categories/[category]': '/categories/[category]',
  '/case-studies': '/case-studies',
  '/case-studies/[slug]': '/case-studies/[slug]',
  '/about': '/about',
  '/blog': '/blog',
  '/blog/[slug]': '/blog/[slug]',
  '/quote': '/quote',
  '/contact': '/contact',
  '/privacy': '/privacy',
  '/terms': '/terms'
};

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createLocalizedPathnamesNavigation({locales, pathnames, localePrefix});
