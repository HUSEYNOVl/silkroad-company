import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '⚙️ Site Settings',
  type: 'document',
  icon: CogIcon,
  // Only one document of this type allowed
  // singleton (no create/delete)
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      initialValue: 'Silk Road',
    }),
    defineField({
      name: 'tagline',
      title: 'Company Tagline',
      type: 'localizedString',
      description: 'Short tagline shown in the header/logo area.',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Main contact email shown on the site.',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Include country code, no spaces or dashes. Example: 994506651805',
    }),
    defineField({
      name: 'wechat',
      title: 'WeChat ID',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Office Address',
      type: 'localizedString',
    }),
    defineField({
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      description: 'Upload your company logo. Leave empty to use text logo.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Small icon shown in browser tab. Use a square image (32×32 or 64×64px).',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      options: { collapsible: true, collapsed: true } as any,
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter / X URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO (used as fallback for all pages)',
      type: 'seoObject',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
