import {z} from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  contact: z.string().trim().min(5).max(160),
  need: z.string().trim().min(10).max(2000),
  budget: z.enum(['', '<$1k', '$1k-10k', '$10k-50k', '$50k+']).optional(),
  company: z.string().max(0).optional()
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  productName: z.string().trim().min(2).max(160),
  category: z.enum(['electronics', 'home', 'beauty', 'fashion', 'packaging', 'industrial', 'furniture', 'toys', 'auto', 'medical', 'sports', 'other']),
  quantity: z.string().trim().min(1).max(120),
  targetPrice: z.string().trim().max(120).optional(),
  referenceUrl: z.string().trim().url().optional().or(z.literal('')),
  files: z.array(z.string().trim().min(1)).max(5).optional(),
  destinationCountry: z.enum(['azerbaijan', 'turkey', 'russia', 'uae', 'kazakhstan', 'germany', 'uk', 'other']),
  oemRequired: z.boolean(),
  customPackaging: z.boolean(),
  shippingPreference: z.enum(['air', 'sea', 'rail', 'truck', 'not-sure']),
  sampleNeeded: z.boolean(),
  notes: z.string().trim().max(1000).optional(),
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().email().max(160),
  whatsapp: z.string().trim().min(7).max(60),
  wechat: z.string().trim().max(120).optional(),
  source: z.enum(['google', 'linkedin', 'referral', 'instagram', 'other']).optional().or(z.literal('')),
  website: z.string().max(0).optional()
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
