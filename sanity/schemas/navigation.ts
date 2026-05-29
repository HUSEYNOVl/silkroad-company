import { defineType, defineField } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export const navigation = defineType({
  name: 'navigation',
  title: '🧭 Navigation',
  type: 'document',
  icon: MenuIcon,
  // singleton (no create/delete)
  fields: [
    defineField({
      name: 'logoText',
      title: 'Logo / Brand Name',
      type: 'string',
      description: 'Text shown in top-left corner. Leave empty to use the image logo from Site Settings.',
      initialValue: 'Silk Road',
    }),
    defineField({
      name: 'mainLinks',
      title: 'Main Menu Links',
      type: 'array',
      description: 'Top navigation links.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Link Label', type: 'localizedString' }),
            defineField({ name: 'href', title: 'URL Path', type: 'string', description: 'Example: /about' }),
          ],
          preview: { select: { title: 'label.en', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'servicesDropdown',
      title: 'Services Dropdown Menu',
      type: 'array',
      description: 'Items shown in the Services dropdown.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Service Title', type: 'localizedString' }),
            defineField({ name: 'text', title: 'Short Description', type: 'localizedString' }),
            defineField({ name: 'href', title: 'URL Path', type: 'string' }),
          ],
          preview: { select: { title: 'title.en', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Top Navigation CTA Button',
      type: 'localizedString',
      description: 'Text for the main action button in the nav. Example: "Get a Quote"',
    }),
  ],
  preview: { prepare: () => ({ title: 'Navigation' }) },
})
