import { defineType, defineField } from 'sanity'
import { EarthGlobeIcon } from '@sanity/icons'

export const regionalRoute = defineType({
  name: 'regionalRoute',
  title: '🌍 Regional Routes',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'from',
      title: 'Origin City',
      type: 'string',
      description: 'Example: Guangzhou',
      initialValue: 'Guangzhou',
    }),
    defineField({
      name: 'to',
      title: 'Destination City / Country',
      type: 'string',
      description: 'Example: Baku',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'flag',
      title: 'Flag Emoji',
      type: 'string',
      description: 'Copy and paste the flag emoji. Example: 🇦🇿',
    }),
    defineField({
      name: 'mode',
      title: 'Shipping Mode',
      type: 'string',
      description: 'Example: Sea + Land, Air / Sea',
    }),
    defineField({
      name: 'days',
      title: 'Transit Days',
      type: 'string',
      description: 'Example: 15–20d',
    }),
    defineField({
      name: 'description',
      title: 'Route Description',
      type: 'localizedText',
      description: 'Optional: extra details about this route.',
    }),
    defineField({
      name: 'cities',
      title: 'Major Cities Served',
      type: 'array',
      description: 'List of cities in this region.',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'isActive',
      title: 'Show on website?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'to', subtitle: 'mode', flag: 'flag' },
    prepare: ({ title, subtitle, flag }) => ({
      title: `${flag ?? ''} ${title ?? 'No destination'}`,
      subtitle: subtitle ?? '',
    }),
  },
})
