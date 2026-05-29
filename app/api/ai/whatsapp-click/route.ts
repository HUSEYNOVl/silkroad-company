import {NextRequest, NextResponse} from 'next/server';
import {createServiceSupabaseClient} from '@/lib/supabase/server';
import {whatsappClickSchema} from '@/lib/validators/chat';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = whatsappClickSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid request'}, {status: 400});
  }

  try {
    const supabase = createServiceSupabaseClient();
    const {data: lead, error: leadError} = await supabase
      .from('leads')
      .update({whatsapp_clicked: true, whatsapp_clicked_at: new Date().toISOString()})
      .eq('lead_code', parsed.data.lead_code)
      .select('id, lead_code')
      .single();
    if (leadError) throw leadError;

    await supabase.from('ai_events').insert({
      lead_id: lead.id,
      event_type: 'whatsapp_clicked',
      event_data: {lead_code: lead.lead_code}
    });

    return NextResponse.json({success: true});
  } catch {
    return NextResponse.json({error: 'Unable to track WhatsApp click'}, {status: 500});
  }
}
