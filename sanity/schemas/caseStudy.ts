import { defineType, defineField } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: '⭐ Case Studies',
  type: 'document',
  icon: StarIcon,
  groups: [
    { name: 'content', title: '📝 Content' },
    { name: 'metrics', title: '📊 Results & Metrics' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Case Study Title',
      type: 'localizedString',
      group: 'content',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title.en', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Category Tag',
      type: 'localizedString',
      group: 'content',
      description: 'Example: "Electronics", "Fashion", "Packaging"',
    }),
    defineField({
      name: 'destination',
      title: 'Destination Country',
      type: 'string',
      group: 'content',
      description: 'Example: Azerbaijan, Turkey, Germany',
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Image Description', type: 'string' })],
    }),
    defineField({
      name: 'problem',
      title: 'The Problem / Challenge',
      type: 'localizedText',
      group: 'content',
      description: 'What problem did the client face?',
    }),
    defineField({
      name: 'solution',
      title: 'What We Did',
      type: 'localizedText',
      group: 'content',
    }),
    defineField({
      name: 'result',
      title: 'The Result',
      type: 'localizedText',
      group: 'content',
    }),
    defineField({
      name: 'metrics',
      title: 'Key Metrics (shown as numbers)',
      type: 'array',
      group: 'metrics',
      description: 'Add 3 metrics with a value and label. Example: "$2.40" and "Unit Price".',
      validation: (R) => R.max(3),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Metric Value', type: 'string', description: 'Example: $2.40 or 500' }),
            defineField({ name: 'label', title: 'Metric Label', type: 'localizedString' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label.en' } },
        },
      ],
    }),
    defineField({
      name: 'isPublished',
      title: 'Published?',
      type: 'boolean',
      initialValue: false,
      description: 'Turn ON to show this case study on the website.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoObject',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'destination', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? 'No title',
      subtitle: subtitle ?? '',
      media,
    }),
  },
})
