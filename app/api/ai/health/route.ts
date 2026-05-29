import {NextResponse} from 'next/server';
import {createServiceSupabaseClient} from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

  // Test 1: raw network reachability
  let rawFetch: {ok: boolean; status?: number; error?: string} = {ok: false};
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''},
      signal: AbortSignal.timeout(8000),
    });
    rawFetch = {ok: res.ok, status: res.status};
  } catch (err) {
    const cause = (err as {cause?: unknown}).cause;
    rawFetch = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      ...(cause ? {cause: String(cause)} : {})
    } as typeof rawFetch;
  }

  // Test 2: Supabase client query
  let supabaseQuery: {ok: boolean; error?: string} = {ok: false};
  try {
    const supabase = createServiceSupabaseClient();
    const {error} = await supabase.from('leads').select('id').limit(1);
    supabaseQuery = error
      ? {ok: false, error: `${error.message} (code: ${error.code})`}
      : {ok: true};
  } catch (err) {
    const cause = (err as {cause?: unknown}).cause;
    supabaseQuery = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      ...(cause ? {cause: String(cause)} : {})
    } as typeof supabaseQuery;
  }

  return NextResponse.json({
    supabaseUrl: supabaseUrl.slice(0, 40),
    rawFetch,
    supabaseQuery,
  });
}
