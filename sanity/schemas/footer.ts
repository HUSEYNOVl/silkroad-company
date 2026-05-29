import { defineType, defineField } from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: '🦶 Footer',
  type: 'document',
  // singleton (no create/delete)
  fields: [
    defineField({
      name: 'tagline',
      title: 'Footer Tagline',
      type: 'localizedText',
      description: 'Short description shown below the logo in the footer.',
    }),
    defineField({
      name: 'columns',
      title: 'Footer Link Columns',
      type: 'array',
      description: 'Add sections with links. Example: "Company" column with About, Contact, Blog links.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Column Title', type: 'localizedString' }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Link Label', type: 'localizedString' }),
                    defineField({ name: 'href', title: 'URL', type: 'string' }),
                  ],
                  preview: { select: { title: 'label.en', subtitle: 'href' } },
                },
              ],
            }),
          ],
          preview: { select: { title: 'title.en' } },
        },
      ],
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'localizedString',
      description: 'Example: "© 2025 Silk Road. All rights reserved."',
    }),
    defineField({
      name: 'bottomLinks',
      title: 'Bottom Links (Privacy, Terms etc.)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'localizedString' }),
            defineField({ name: 'href', title: 'URL', type: 'string' }),
          ],
          preview: { select: { title: 'label.en' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Footer' }) },
})
