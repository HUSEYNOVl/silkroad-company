'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {createBrowserClient} from '@supabase/ssr';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Supabase is not configured.');
      setLoading(false);
      return;
    }

    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const {error: signInError} = await supabase.auth.signInWithPassword({email, password});
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push('/admin/leads');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-5">
      <form onSubmit={submit} className="w-full max-w-sm border border-border bg-bg-elevated p-8">
        <p className="font-mono text-eyebrow uppercase tracking-[0.2em] text-accent">Admin</p>
        <h1 className="mt-4 font-display text-3xl font-medium text-fg-primary">Sign in</h1>
        <label className="mt-8 grid gap-2 text-sm font-medium text-fg-primary">
          Email
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-medium text-fg-primary">
          Password
          <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="mt-6 h-11 w-full bg-accent text-sm font-semibold text-bg-dark disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
