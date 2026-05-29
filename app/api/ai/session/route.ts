import {NextRequest, NextResponse} from 'next/server';
import {createServiceSupabaseClient} from '@/lib/supabase/server';
import {sessionRequestSchema} from '@/lib/validators/chat';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const parsed = sessionRequestSchema.safeParse({
    session_id: request.nextUrl.searchParams.get('session_id')
  });
  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid request'}, {status: 400});
  }

  try {
    const supabase = createServiceSupabaseClient();
    const {data, error} = await supabase
      .from('conversations')
      .select('lead_id')
      .eq('session_id', parsed.data.session_id)
      .maybeSingle();
    if (error) throw error;
    if (!data?.lead_id) return NextResponse.json({lead_code: null});
    const {data: lead, error: leadError} = await supabase
      .from('leads')
      .select('lead_code')
      .eq('id', data.lead_id)
      .maybeSingle();
    if (leadError) throw leadError;
    return NextResponse.json({lead_code: lead?.lead_code ?? null});
  } catch {
    return NextResponse.json({lead_code: null});
  }
}
