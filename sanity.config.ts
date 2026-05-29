import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name: 'silk-road-studio',
  title: 'Silk Road CMS',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('⚙️ Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('🏠 Homepage')
              .id('homepage')
              .child(S.document().schemaType('homepage').documentId('homepage')),
            S.listItem()
              .title('🧭 Navigation')
              .id('navigation')
              .child(S.document().schemaType('navigation').documentId('navigation')),
            S.listItem()
              .title('🦶 Footer')
              .id('footer')
              .child(S.document().schemaType('footer').documentId('footer')),
            S.divider(),
            // Collections
            S.documentTypeListItem('service').title('🔧 Services'),
            S.documentTypeListItem('category').title('📦 Product Categories'),
            S.documentTypeListItem('faq').title('❓ FAQ'),
            S.documentTypeListItem('caseStudy').title('⭐ Case Studies'),
            S.documentTypeListItem('blogPost').title('📰 Blog Posts'),
            S.documentTypeListItem('regionalRoute').title('🌍 Regional Routes'),
            S.divider(),
            S.documentTypeListItem('aiKnowledgeBase').title('🤖 AI Knowledge Base'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
