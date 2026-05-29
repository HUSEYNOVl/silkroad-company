import Link from 'next/link';
import {createServiceSupabaseClient} from '@/lib/supabase/server';

const scoreClasses: Record<string, string> = {
  hot: 'bg-red-100 text-red-700',
  warm: 'bg-amber-100 text-amber-700',
  cold: 'bg-blue-100 text-blue-700'
};

export default async function AdminLeadsPage() {
  const supabase = createServiceSupabaseClient();
  const {data: leads, error} = await supabase
    .from('leads')
    .select('*')
    .order('created_at', {ascending: false})
    .limit(50);

  if (error) {
    return (
      <main className="min-h-screen bg-bg-primary p-8">
        <p className="text-red-500">Unable to load leads.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary p-6 md:p-10">
      <div className="mb-8">
        <p className="font-mono text-eyebrow uppercase tracking-[0.2em] text-accent">Admin</p>
        <h1 className="mt-3 font-display text-4xl font-medium text-fg-primary">Leads</h1>
      </div>
      <div className="overflow-x-auto border border-border bg-bg-elevated">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-bg-secondary text-xs uppercase text-fg-tertiary">
            <tr>
              {['Lead Code', 'Product', 'Destination', 'Qty', 'Score', 'Status', 'WA', 'Created'].map((heading) => (
                <th key={heading} className="border-b border-border px-4 py-3 font-mono font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead) => {
              const score = lead.quality_score ?? 'cold';
              return (
                <tr key={lead.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-mono text-xs text-accent">
                    <Link href={`/admin/leads/${lead.lead_code}`}>{lead.lead_code}</Link>
                  </td>
                  <td className="px-4 py-3 text-fg-primary">{lead.product_name ?? '-'}</td>
                  <td className="px-4 py-3 text-fg-secondary">{lead.destination_country ?? '-'}</td>
                  <td className="px-4 py-3 text-fg-secondary">{lead.quantity ?? '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold ${scoreClasses[score] ?? scoreClasses.cold}`}>{score}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="border border-border px-2 py-1 text-xs text-fg-secondary">{lead.status ?? 'new'}</span>
                  </td>
                  <td className={`px-4 py-3 ${lead.whatsapp_clicked ? 'text-green-600' : 'text-fg-tertiary'}`}>{lead.whatsapp_clicked ? '✓' : '—'}</td>
                  <td className="px-4 py-3 text-fg-tertiary">{new Date(lead.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
