import {z} from 'zod';

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  session_id: z.string().uuid(),
  lead_code: z.string().trim().min(1).max(40).optional(),
  locale: z.string().trim().min(2).max(8).default('en')
});

export const sessionRequestSchema = z.object({
  session_id: z.string().uuid()
});

export const whatsappClickSchema = z.object({
  lead_code: z.string().trim().min(1).max(40)
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
