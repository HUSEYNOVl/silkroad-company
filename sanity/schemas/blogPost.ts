import { defineType, defineField } from 'sanity'
import { EditIcon } from '@sanity/icons'

export const blogPost = defineType({
  name: 'blogPost',
  title: '📰 Blog Posts',
  type: 'document',
  icon: EditIcon,
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'meta', title: '🏷️ Meta & Publishing' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'localizedString',
      group: 'content',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      description: 'Auto-generated from the English title. Example: "how-to-source-from-china"',
      options: { source: 'title.en', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Excerpt / Summary',
      type: 'localizedText',
      group: 'content',
      description: 'Shown on the blog listing page. Keep under 200 characters.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Image Description', type: 'string' })],
    }),
    defineField({
      name: 'content',
      title: 'Full Article Content',
      type: 'localizedBody',
      group: 'content',
    }),
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      group: 'meta',
      initialValue: 'Sarkhan Huseynov',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Sourcing Tips', value: 'sourcing' },
          { title: 'Factory & Quality', value: 'quality' },
          { title: 'Shipping & Logistics', value: 'shipping' },
          { title: 'Market Insights', value: 'insights' },
          { title: 'Company News', value: 'news' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isPublished',
      title: 'Published?',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Turn ON to show this post on the website.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoObject',
      group: 'seo',
    }),
  ],
  orderings: [
    { title: 'Newest First', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'publishedAt', media: 'coverImage', published: 'isPublished' },
    prepare: ({ title, subtitle, media, published }) => ({
      title: (published ? '✅ ' : '📝 ') + (title ?? 'No title'),
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'No date',
      media,
    }),
  },
})
