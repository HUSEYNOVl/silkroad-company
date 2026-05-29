import { defineType, defineField } from 'sanity'

const langFields = (type: string) => [
  defineField({ name: 'en', title: '🇬🇧 English', type }),
  defineField({ name: 'az', title: '🇦🇿 Azerbaijani (Latin)', type }),
  defineField({ name: 'tr', title: '🇹🇷 Turkish', type }),
  defineField({ name: 'ru', title: '🇷🇺 Russian', type }),
  defineField({ name: 'ar', title: '🇸🇦 Arabic (RTL)', type }),
]

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  options: { collapsible: true, collapsed: false } as any,
  fields: langFields('string'),
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  options: { collapsible: true, collapsed: true } as any,
  fields: langFields('text'),
})

export const localizedBody = defineType({
  name: 'localizedBody',
  title: 'Localized Rich Text',
  type: 'object',
  options: { collapsible: true, collapsed: true } as any,
  fields: [
    defineField({ name: 'en', title: '🇬🇧 English', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'az', title: '🇦🇿 Azerbaijani', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'tr', title: '🇹🇷 Turkish', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'ru', title: '🇷🇺 Russian', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'ar', title: '🇸🇦 Arabic (RTL)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
  ],
})
