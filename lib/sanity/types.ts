export type Locale = 'en' | 'az' | 'tr' | 'ru' | 'ar'

export type LocalizedString = Partial<Record<Locale, string>>
export type LocalizedText = Partial<Record<Locale, string>>
export type LocalizedBody = Partial<Record<Locale, any[]>>

export interface SanityImage {
  asset: { _ref: string; _type: string }
  alt?: string
  hotspot?: { x: number; y: number }
}

export interface SEOObject {
  title?: LocalizedString
  description?: LocalizedText
  ogImage?: SanityImage
  noindex?: boolean
}

// Utility: pick locale string with English fallback
export function loc(field: LocalizedString | undefined | null, locale: string): string {
  if (!field) return ''
  return (field as any)[locale] || field.en || ''
}

// ─── Document Types ────────────────────────────────────────────

export interface SanitySiteSettings {
  _id: string
  companyName?: string
  email?: string
  whatsapp?: string
  wechat?: string
  address?: LocalizedString
  socialLinks?: {
    instagram?: string
    linkedin?: string
    youtube?: string
    facebook?: string
    twitter?: string
  }
}

export interface SanityHomepage {
  _id: string
  heroEyebrow?: LocalizedString
  heroTitle?: LocalizedString
  heroSubtitle?: LocalizedText
  heroPrimaryCta?: LocalizedString
  heroSecondaryCta?: LocalizedString
  heroBackgroundImage?: SanityImage & { alt?: string }
  heroTrustItems?: LocalizedString[]
  trustStats?: Array<{ value: string; label: LocalizedString }>
  processSectionEyebrow?: LocalizedString
  processSectionTitle?: LocalizedString
  processSteps?: Array<{ title: LocalizedString; text: LocalizedText }>
  regionalQuote?: LocalizedText
  seo?: SEOObject
}

export interface SanityService {
  _id: string
  title: LocalizedString
  slug: { current: string }
  icon?: string
  eyebrow?: LocalizedString
  description?: LocalizedText
  image?: SanityImage
  bulletPoints?: LocalizedString[]
  order?: number
  seo?: SEOObject
}

export interface SanityCategory {
  _id: string
  name: LocalizedString
  slug: { current: string }
  image?: SanityImage
  description?: LocalizedText
  moqRange?: string
  hasOEM?: boolean
  hasInspection?: boolean
  hasShipping?: boolean
  order?: number
  seo?: SEOObject
}

export interface SanityFaq {
  _id: string
  question: LocalizedString
  answer: LocalizedText
  order: number
  isActive: boolean
}

export interface SanityCaseStudy {
  _id: string
  title: LocalizedString
  slug: { current: string }
  tag?: LocalizedString
  destination?: string
  image?: SanityImage
  problem?: LocalizedText
  solution?: LocalizedText
  result?: LocalizedText
  metrics?: Array<{ value: string; label: LocalizedString }>
  isPublished: boolean
  seo?: SEOObject
}

export interface SanityBlogPost {
  _id: string
  title: LocalizedString
  slug: { current: string }
  excerpt?: LocalizedText
  coverImage?: SanityImage
  author?: string
  category?: string
  tags?: string[]
  publishedAt?: string
  isPublished: boolean
  content?: LocalizedBody
  seo?: SEOObject
}

export interface SanityRegionalRoute {
  _id: string
  from?: string
  to: string
  flag?: string
  mode?: string
  days?: string
  description?: LocalizedText
  cities?: string[]
  isActive: boolean
  order?: number
}

export interface SanityAIKnowledge {
  _id: string
  title: string
  topic: string
  content: LocalizedText
  priority: number
  isActive: boolean
}

export interface SanityNavigation {
  _id: string
  logoText?: string
  mainLinks?: Array<{ label: LocalizedString; href: string }>
  servicesDropdown?: Array<{ title: LocalizedString; text: LocalizedString; href: string }>
  ctaLabel?: LocalizedString
}

export interface SanityFooter {
  _id: string
  tagline?: LocalizedText
  columns?: Array<{
    title: LocalizedString
    links: Array<{ label: LocalizedString; href: string }>
  }>
  copyrightText?: LocalizedString
  bottomLinks?: Array<{ label: LocalizedString; href: string }>
}
