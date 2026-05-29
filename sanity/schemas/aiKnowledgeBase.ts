import { defineType, defineField } from 'sanity'
import { RobotIcon } from '@sanity/icons'

export const aiKnowledgeBase = defineType({
  name: 'aiKnowledgeBase',
  title: '🤖 AI Knowledge Base',
  type: 'document',
  icon: RobotIcon,
  description: 'Each entry here teaches the AI assistant about your business. The AI uses these to answer customer questions.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (for your reference)',
      type: 'string',
      description: 'Internal label only. Not shown to customers.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'topic',
      title: 'Topic Category',
      type: 'string',
      options: {
        list: [
          { title: 'What the company does', value: 'company' },
          { title: 'How sourcing works', value: 'sourcing' },
          { title: 'Factory verification', value: 'factory' },
          { title: 'OEM / Private Label', value: 'oem' },
          { title: 'Quality inspection', value: 'quality' },
          { title: 'Shipping & logistics', value: 'shipping' },
          { title: 'Payment process', value: 'payment' },
          { title: 'WhatsApp handoff', value: 'whatsapp' },
          { title: 'Countries served', value: 'countries' },
          { title: 'Limitations & disclaimers', value: 'limitations' },
          { title: 'Frequently asked questions', value: 'faq' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'content',
      title: 'Knowledge Content',
      type: 'localizedText',
      description: 'Write the information you want the AI to know. Be clear and specific. The AI will use this to answer customer questions.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'priority',
      title: 'Priority (1 = most important)',
      type: 'number',
      description: 'Higher priority entries are given more weight. Use 1 for the most critical info.',
      initialValue: 5,
      validation: (R) => R.min(1).max(10),
    }),
    defineField({
      name: 'isActive',
      title: 'Active? (AI uses this)',
      type: 'boolean',
      initialValue: true,
      description: 'Turn OFF to stop the AI from using this entry without deleting it.',
    }),
  ],
  orderings: [{ title: 'Priority (High First)', name: 'priorityAsc', by: [{ field: 'priority', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'topic', active: 'isActive' },
    prepare: ({ title, subtitle, active }) => ({
      title: (active ? '🟢 ' : '🔴 ') + (title ?? 'No title'),
      subtitle: subtitle ?? '',
    }),
  },
})
