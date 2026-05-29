import { defineType, defineField } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

export const faq = defineType({
  name: 'faq',
  title: '❓ FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'localizedString',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'localizedText',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 99,
    }),
    defineField({
      name: 'isActive',
      title: 'Show on website?',
      type: 'boolean',
      initialValue: true,
      description: 'Turn OFF to hide this FAQ without deleting it.',
    }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'question.en', subtitle: 'isActive' },
    prepare: ({ title, subtitle }) => ({
      title: title ?? 'No question',
      subtitle: subtitle ? '✅ Active' : '⏸ Hidden',
    }),
  },
})
