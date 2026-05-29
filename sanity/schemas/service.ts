import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const service = defineType({
  name: 'service',
  title: '🔧 Services',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'page', title: '📄 Page Content' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Service Name',
      type: 'localizedString',
      group: 'content',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      description: 'Used in the URL. Example: "product-sourcing" → /services/product-sourcing',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name (from Lucide icons)',
      type: 'string',
      group: 'content',
      description: 'Optional: icon identifier. Leave blank to use default.',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Label (small text above title)',
      type: 'localizedString',
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Short Description (shown on cards)',
      type: 'localizedText',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Service Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Image Description', type: 'string' }),
      ],
    }),
    defineField({
      name: 'bulletPoints',
      title: 'Key Features / Bullet Points',
      type: 'array',
      group: 'page',
      description: 'List of features shown on the service detail page.',
      of: [{ type: 'localizedString' }],
    }),
    defineField({
      name: 'fullContent',
      title: 'Full Page Content',
      type: 'localizedBody',
      group: 'page',
      description: 'Rich text content for the full service detail page.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'content',
      description: 'Lower numbers appear first. Use 1, 2, 3...',
      initialValue: 99,
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoObject',
      group: 'seo',
    }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.en', subtitle: 'slug.current', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? 'No title',
      subtitle: `/services/${subtitle}`,
      media,
    }),
  },
})
