import { sanityClient, isSanityConfigured } from './client'
import type {
  SanityHomepage, SanityService, SanityCategory, SanityFaq,
  SanityCaseStudy, SanityBlogPost, SanityRegionalRoute,
  SanityAIKnowledge, SanitySiteSettings, SanityNavigation, SanityFooter,
} from './types'

// Safe fetch — returns null if Sanity is not configured or query fails
async function safeFetch<T>(query: string, params: Record<string, any> = {}): Promise<T | null> {
  if (!isSanityConfigured()) return null
  try {
    return await sanityClient.fetch<T>(query, params, { next: { revalidate: 60 } })
  } catch {
    return null
  }
}

// ─── Singletons ────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return safeFetch(`*[_type == "siteSettings"][0]`)
}

export async function getHomepage(): Promise<SanityHomepage | null> {
  return safeFetch(`*[_type == "homepage"][0]{
    _id, heroEyebrow, heroTitle, heroSubtitle, heroPrimaryCta, heroSecondaryCta,
    heroBackgroundImage{ asset, alt, hotspot },
    heroTrustItems,
    trustStats[]{ value, label },
    processSectionEyebrow, processSectionTitle,
    processSteps[]{ title, text },
    regionalQuote,
    seo{ title, description, ogImage{ asset }, noindex }
  }`)
}

export async function getNavigation(): Promise<SanityNavigation | null> {
  return safeFetch(`*[_type == "navigation"][0]{
    _id, logoText,
    mainLinks[]{ label, href },
    servicesDropdown[]{ title, text, href },
    ctaLabel
  }`)
}

export async function getFooter(): Promise<SanityFooter | null> {
  return safeFetch(`*[_type == "footer"][0]{
    _id, tagline,
    columns[]{ title, links[]{ label, href } },
    copyrightText,
    bottomLinks[]{ label, href }
  }`)
}

// ─── Collections ───────────────────────────────────────────────

export async function getServices(): Promise<SanityService[]> {
  return (await safeFetch<SanityService[]>(`*[_type == "service"] | order(order asc){
    _id, title, slug, icon, eyebrow, description, image{ asset, alt, hotspot }, bulletPoints, order, seo
  }`)) ?? []
}

export async function getServiceBySlug(slug: string): Promise<SanityService | null> {
  return safeFetch(`*[_type == "service" && slug.current == $slug][0]{
    _id, title, slug, icon, eyebrow, description, image{ asset, alt, hotspot },
    bulletPoints, fullContent, order, seo
  }`, { slug })
}

export async function getCategories(): Promise<SanityCategory[]> {
  return (await safeFetch<SanityCategory[]>(`*[_type == "category"] | order(order asc){
    _id, name, slug, image{ asset, alt, hotspot }, description, moqRange,
    hasOEM, hasInspection, hasShipping, order, seo
  }`)) ?? []
}

export async function getCategoryBySlug(slug: string): Promise<SanityCategory | null> {
  return safeFetch(`*[_type == "category" && slug.current == $slug][0]{
    _id, name, slug, image{ asset, alt, hotspot }, description, moqRange,
    hasOEM, hasInspection, hasShipping, seo
  }`, { slug })
}

export async function getFaqs(): Promise<SanityFaq[]> {
  return (await safeFetch<SanityFaq[]>(`*[_type == "faq" && isActive == true] | order(order asc){
    _id, question, answer, order, isActive
  }`)) ?? []
}

export async function getCaseStudies(): Promise<SanityCaseStudy[]> {
  return (await safeFetch<SanityCaseStudy[]>(`*[_type == "caseStudy" && isPublished == true]{
    _id, title, slug, tag, destination, image{ asset, alt, hotspot },
    metrics[]{ value, label }, isPublished, seo
  }`)) ?? []
}

export async function getCaseStudyBySlug(slug: string): Promise<SanityCaseStudy | null> {
  return safeFetch(`*[_type == "caseStudy" && slug.current == $slug && isPublished == true][0]{
    _id, title, slug, tag, destination, image{ asset, alt, hotspot },
    problem, solution, result, metrics[]{ value, label }, isPublished, seo
  }`, { slug })
}

export async function getBlogPosts(): Promise<SanityBlogPost[]> {
  return (await safeFetch<SanityBlogPost[]>(`*[_type == "blogPost" && isPublished == true] | order(publishedAt desc){
    _id, title, slug, excerpt, coverImage{ asset, alt, hotspot },
    author, category, tags, publishedAt, isPublished, seo
  }`)) ?? []
}

export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  return safeFetch(`*[_type == "blogPost" && slug.current == $slug && isPublished == true][0]{
    _id, title, slug, excerpt, coverImage{ asset, alt, hotspot },
    content, author, category, tags, publishedAt, isPublished, seo
  }`, { slug })
}

export async function getRegionalRoutes(): Promise<SanityRegionalRoute[]> {
  return (await safeFetch<SanityRegionalRoute[]>(`*[_type == "regionalRoute" && isActive == true] | order(order asc){
    _id, from, to, flag, mode, days, description, cities, isActive, order
  }`)) ?? []
}

export async function getAIKnowledge(locale = 'en'): Promise<SanityAIKnowledge[]> {
  return (await safeFetch<SanityAIKnowledge[]>(`*[_type == "aiKnowledgeBase" && isActive == true] | order(priority asc){
    _id, title, topic, content, priority, isActive
  }`)) ?? []
}
