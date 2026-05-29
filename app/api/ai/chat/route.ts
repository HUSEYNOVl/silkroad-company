import {openai} from '@ai-sdk/openai';
import {streamText} from 'ai';
import {NextRequest, NextResponse} from 'next/server';
import {buildSystemPrompt} from '@/lib/ai/system-prompt';
import {getBusinessKnowledge} from '@/lib/ai/business-knowledge';
import {extractLeadData} from '@/lib/ai/lead-extractor';
import {generateWhatsAppLink, generateWhatsAppPrefillText, shouldShowWhatsAppCta} from '@/lib/ai/whatsapp';
import {getOrCreateSession, appendToHistory} from '@/lib/ai/session-store';
import {chatRequestSchema} from '@/lib/validators/chat';

export const runtime = 'nodejs';

const rateLimitStore = new Map<string, {count: number; resetAt: number}>();

function getIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(ip);
  if (!current || current.resetAt < now) {
    rateLimitStore.set(ip, {count: 1, resetAt: now + 60 * 60 * 1000});
    return true;
  }
  if (current.count >= 30) return false;
  current.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid request'}, {status: 400});
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({error: 'AI service is not configured'}, {status: 503});
  }

  const ip = getIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({error: 'Too many requests'}, {status: 429});
  }

  const {message, session_id, locale} = parsed.data;
  const session = getOrCreateSession(session_id);
  session.lead.lead_code = session.leadCode;
  session.messageCount += 1;

  const businessKnowledge = await getBusinessKnowledge(locale);

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: buildSystemPrompt(session.lead, locale, businessKnowledge),
    messages: [
      ...session.history,
      {role: 'user', content: message}
    ]
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let assistantText = '';
      try {
        for await (const delta of result.textStream) {
          assistantText += delta;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({delta})}\n\n`));
        }

        appendToHistory(session, 'user', message);
        appendToHistory(session, 'assistant', assistantText);

        // Non-blocking: update lead data for the NEXT turn without blocking this response
        const historySnapshot = [...session.history];
        extractLeadData(historySnapshot).then((extracted) => {
          if (extracted && Object.keys(extracted).length > 0) {
            session.lead = {...session.lead, ...extracted, lead_code: session.leadCode};
          }
        }).catch(() => {});

        // CTA check uses lead data from the PREVIOUS turn (already extracted) — instant
        const aiSignaledReady = assistantText.includes(session.leadCode);
        const showCta = shouldShowWhatsAppCta(session.lead) || session.messageCount >= 5 || aiSignaledReady;
        const leadForCta = {...session.lead, lead_code: session.leadCode};

        const metadata = {
          lead_code: session.leadCode,
          show_whatsapp_cta: showCta,
          whatsapp_link: showCta ? generateWhatsAppLink(leadForCta, locale) : null,
          whatsapp_prefill_text: showCta ? generateWhatsAppPrefillText(leadForCta, locale) : null,
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({__metadata__: metadata})}\n\n`));
      } catch (err) {
        console.error('[chat] stream error:', err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({error: 'AI response failed'})}\n\n`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    }
  });
}
