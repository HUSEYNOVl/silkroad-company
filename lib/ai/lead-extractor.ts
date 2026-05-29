import OpenAI from 'openai';
import {z} from 'zod';
import type {Lead} from '@/lib/supabase/types';

const extractedLeadSchema = z.object({
  status: z.string().nullable().optional(),
  quality_score: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  locale: z.string().nullable().optional(),
  client_name: z.string().nullable().optional(),
  company_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  wechat: z.string().nullable().optional(),
  product_name: z.string().nullable().optional(),
  product_category: z.string().nullable().optional(),
  quantity: z.string().nullable().optional(),
  target_price: z.string().nullable().optional(),
  destination_country: z.string().nullable().optional(),
  oem_required: z.boolean().nullable().optional(),
  custom_packaging: z.boolean().nullable().optional(),
  shipping_preference: z.string().nullable().optional(),
  urgency: z.string().nullable().optional(),
  budget: z.string().nullable().optional(),
  reference_url: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  conversation_summary: z.string().nullable().optional(),
  missing_fields: z.array(z.string()).nullable().optional(),
  last_ai_recommendation: z.string().nullable().optional(),
  quality_score_reason: z.string().nullable().optional(),
  whatsapp_link: z.string().nullable().optional(),
  whatsapp_prefill_text: z.string().nullable().optional(),
  whatsapp_link_generated: z.boolean().nullable().optional(),
  whatsapp_cta_shown_at: z.string().nullable().optional(),
  whatsapp_clicked: z.boolean().nullable().optional(),
  whatsapp_clicked_at: z.string().nullable().optional(),
  quote_intent_detected: z.boolean().nullable().optional(),
  whatsapp_push_ready: z.boolean().nullable().optional()
});

type ExtractedLead = z.infer<typeof extractedLeadSchema>;

export async function extractLeadData(
  messages: {role: string; content: string}[]
): Promise<Partial<Lead> & Pick<ExtractedLead, 'quote_intent_detected' | 'whatsapp_push_ready'>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return {};

  const client = new OpenAI({apiKey});
  const conversation = messages.map((message) => `${message.role}: ${message.content}`).join('\n');

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: {type: 'json_object'},
      messages: [
        {
          role: 'system',
          content: [
            'Return JSON only.',
            'Extract lead data from the conversation.',
            'Use null for unknown values.',
            'quality_score must be cold, warm, or hot.',
            'Extract all lead fields plus quality_score, quality_score_reason, conversation_summary, missing_fields, quote_intent_detected, and whatsapp_push_ready.'
          ].join(' ')
        },
        {role: 'user', content: conversation}
      ]
    });

    const content = completion.choices[0]?.message.content ?? '{}';
    const parsed = extractedLeadSchema.safeParse(JSON.parse(content));
    if (!parsed.success) return {};
    return parsed.data;
  } catch {
    return {};
  }
}
