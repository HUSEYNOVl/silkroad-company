import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const category = defineType({
  name: 'category',
  title: '📦 Product Categories',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'localizedString',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Example: "electronics" → /categories/electronics',
      options: { source: 'name.en', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Image Description', type: 'string' })],
    }),
    defineField({
      name: 'description',
      title: 'Category Description',
      type: 'localizedText',
    }),
    defineField({
      name: 'moqRange',
      title: 'MOQ Range',
      type: 'string',
      description: 'Minimum Order Quantity range. Example: 200–5,000',
    }),
    defineField({
      name: 'exampleProducts',
      title: 'Example Products',
      type: 'localizedText',
      description: 'Short list of example products in this category.',
    }),
    defineField({
      name: 'hasOEM',
      title: 'OEM / Private Label Available?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'hasInspection',
      title: 'Quality Inspection Available?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'hasShipping',
      title: 'Shipping Support Available?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoObject',
    }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name.en', subtitle: 'moqRange', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? 'No name',
      subtitle: subtitle ? `MOQ: ${subtitle}` : '',
      media,
    }),
  },
})
