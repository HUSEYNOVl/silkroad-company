import {NextRequest, NextResponse} from 'next/server';
import {Resend} from 'resend';
import {quoteSchema} from '@/lib/validators';

function getIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.warn('Upstash Redis is not configured; quote rate limiting is disabled.');
    return true;
  }

  const {Ratelimit} = await import('@upstash/ratelimit');
  const {Redis} = await import('@upstash/redis');
  const ratelimit = new Ratelimit({
    redis: new Redis({url, token}),
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: false
  });
  const {success} = await ratelimit.limit(`quote:${ip}`);
  return success;
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json({error: 'Too many requests'}, {status: 429});
  }

  const json = await request.json().catch(() => null);
  const parsed = quoteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid request'}, {status: 400});
  }

  if (parsed.data.website) {
    return NextResponse.json({ok: true});
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL ?? 'hello@sarkhan.com';
  const from = process.env.QUOTE_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL ?? 'Silk Road <onboarding@resend.dev>';

  if (resendKey) {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from,
      to,
      subject: `New Silk Road quote request from ${parsed.data.name}`,
      text: Object.entries(parsed.data)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value ?? '')}`)
        .join('\n')
    });
  }

  return NextResponse.json({ok: true});
}
