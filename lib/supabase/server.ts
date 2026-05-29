import {cookies} from 'next/headers';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import type {Database} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export function createServiceSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase service credentials are not configured.');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {persistSession: false, autoRefreshToken: false}
  });
}

export function createServerSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase public credentials are not configured.');
  }

  const cookieStore = cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(items) {
        items.forEach(({name, value, options}) => cookieStore.set(name, value, options));
      }
    }
  });
}
