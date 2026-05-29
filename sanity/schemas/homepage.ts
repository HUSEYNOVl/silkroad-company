import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homepage = defineType({
  name: 'homepage',
  title: '🏠 Homepage',
  type: 'document',
  icon: HomeIcon,
  // singleton (no create/delete)
  groups: [
    { name: 'hero', title: '🎯 Hero Section' },
    { name: 'stats', title: '📊 Trust Stats' },
    { name: 'process', title: '🔄 Process Steps' },
    { name: 'regional', title: '🌍 Regional Section' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    // ─── HERO ────────────────────────────────────────────────────
    defineField({
      name: 'heroEyebrow',
      title: 'Hero — Eyebrow Text (small label above title)',
      type: 'localizedString',
      group: 'hero',
      description: 'Example: "AI-Powered Sourcing Platform"',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero — Main Headline',
      type: 'localizedString',
      group: 'hero',
      description: 'The large heading users see first.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero — Subtitle',
      type: 'localizedText',
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCta',
      title: 'Hero — Primary Button Text',
      type: 'localizedString',
      group: 'hero',
      description: 'Example: "Start with AI"',
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Hero — Secondary Button Text',
      type: 'localizedString',
      group: 'hero',
      description: 'Example: "Get a Quote"',
    }),
    defineField({
      name: 'heroBackgroundImage',
      title: 'Hero — Background Image',
      type: 'image',
      group: 'hero',
      description: 'Large background image for the hero section.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Image description (for screen readers)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'heroTrustItems',
      title: 'Hero — Trust Badges (shown below buttons)',
      type: 'array',
      group: 'hero',
      description: 'Short trust items like "500+ Verified Factories". Add one per language.',
      of: [{ type: 'localizedString' }],
    }),

    // ─── TRUST STATS ─────────────────────────────────────────────
    defineField({
      name: 'trustStats',
      title: 'Trust Statistics (the 5 numbers shown in the bar)',
      type: 'array',
      group: 'stats',
      description: 'Add exactly 5 statistics. Example: "500+" and "Verified Factories".',
      validation: (R) => R.max(5),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Number / Value', type: 'string', description: 'Example: 500+ or 8' }),
            defineField({ name: 'label', title: 'Label', type: 'localizedString' }),
          ],
          preview: { select: { title: 'value' } },
        },
      ],
    }),

    // ─── PROCESS STEPS ───────────────────────────────────────────
    defineField({
      name: 'processSectionEyebrow',
      title: 'Process Section — Eyebrow Label',
      type: 'localizedString',
      group: 'process',
    }),
    defineField({
      name: 'processSectionTitle',
      title: 'Process Section — Title',
      type: 'localizedString',
      group: 'process',
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      group: 'process',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Step Title', type: 'localizedString' }),
            defineField({ name: 'text', title: 'Step Description', type: 'localizedText' }),
          ],
          preview: { select: { title: 'title.en' } },
        },
      ],
    }),

    // ─── REGIONAL SECTION ────────────────────────────────────────
    defineField({
      name: 'regionalQuote',
      title: 'Regional Section — Quote (bottom italic text)',
      type: 'localizedText',
      group: 'regional',
      description: 'Shown as a quote at the bottom of the regional map section.',
    }),

    // ─── SEO ─────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoObject',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage' }),
  },
})
