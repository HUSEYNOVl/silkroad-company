import { defineType, defineField } from 'sanity'

export const seoObject = defineType({
  name: 'seoObject',
  title: 'SEO Settings',
  type: 'object',
  options: { collapsible: true, collapsed: true } as any,
  fields: [
    defineField({
      name: 'title',
      title: 'SEO Title (shown in browser tab & Google)',
      type: 'localizedString',
    }),
    defineField({
      name: 'description',
      title: 'SEO Description (shown in Google results)',
      type: 'localizedText',
      description: 'Keep between 120–160 characters for best results.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (OG Image)',
      type: 'image',
      description: 'Image shown when someone shares this page on social media. Recommended: 1200×630px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from search engines (noindex)',
      type: 'boolean',
      initialValue: false,
      description: 'Turn ON to prevent Google from indexing this page.',
    }),
  ],
})
