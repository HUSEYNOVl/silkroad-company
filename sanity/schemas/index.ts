import { localizedString, localizedText, localizedBody } from './shared/localized'
import { seoObject } from './shared/seo'
import { siteSettings } from './siteSettings'
import { homepage } from './homepage'
import { service } from './service'
import { category } from './category'
import { faq } from './faq'
import { caseStudy } from './caseStudy'
import { blogPost } from './blogPost'
import { regionalRoute } from './regionalRoute'
import { aiKnowledgeBase } from './aiKnowledgeBase'
import { navigation } from './navigation'
import { footer } from './footer'

export const schemaTypes = [
  // Shared types (used by other schemas)
  localizedString,
  localizedText,
  localizedBody,
  seoObject,

  // Singleton documents
  siteSettings,
  homepage,
  navigation,
  footer,

  // Collection documents
  service,
  category,
  faq,
  caseStudy,
  blogPost,
  regionalRoute,
  aiKnowledgeBase,
]
