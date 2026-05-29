import {openai} from '@ai-sdk/openai';
import {streamText} from 'ai';
import {NextRequest, NextResponse} from 'next/server';
import {buildSystemPrompt} from '@/lib/ai/system-prompt';
import {getOrCreateSession, appendToHistory} from '@/lib/ai/session-store';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({error: 'AI service is not configured'}, {status: 503});
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({error: 'Invalid form data'}, {status: 400});
  }

  const imageFile = formData.get('image');
  const sessionId = formData.get('session_id');
  const locale = (formData.get('locale') as string | null) ?? 'en';

  if (!(imageFile instanceof File) || typeof sessionId !== 'string') {
    return NextResponse.json({error: 'Missing required fields'}, {status: 400});
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(imageFile.type)) {
    return NextResponse.json({error: 'Unsupported image format. Use JPG, PNG, or WebP.'}, {status: 400});
  }

  if (imageFile.size > 10 * 1024 * 1024) {
    return NextResponse.json({error: 'Image too large (max 10 MB)'}, {status: 400});
  }

  try {
    const session = getOrCreateSession(sessionId);
    session.lead.lead_code = session.leadCode;

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${imageFile.type};base64,${base64}`;

    const result = streamText({
      model: openai('gpt-4o'),
      system: buildSystemPrompt(session.lead, locale),
      messages: [
        ...session.history,
        {
          role: 'user',
          content: [
            {type: 'image', image: dataUrl},
            {
              type: 'text',
              text: 'The user sent a product image. Identify what the product is, describe it in 1-2 sentences, then ask what quantity they need and where it will be shipped to.'
            }
          ]
        }
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

          // Save image turn to session so follow-up chat messages have full context
          appendToHistory(session, 'user', '[User sent a product image]');
          appendToHistory(session, 'assistant', assistantText);

          const metadata = {
            lead_code: session.leadCode,
            show_whatsapp_cta: false,
            whatsapp_link: null,
            whatsapp_prefill_text: null,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({__metadata__: metadata})}\n\n`));
        } catch (err) {
          console.error('[image] stream error:', err);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({error: 'Image analysis failed'})}\n\n`));
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
  } catch (err) {
    console.error('[image] error:', err);
    return NextResponse.json({error: 'Unable to analyze image'}, {status: 500});
  }
}
