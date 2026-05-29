import {getMessages, unstable_setRequestLocale} from 'next-intl/server';
import {Link} from '@/lib/navigation';
import type {Locale} from '@/lib/navigation';

type ServiceItem = {slug: string; title: string; text: string};
type Messages = {services: {detailFallback: string; quoteCta: string; items: ServiceItem[]}};

export async function ServiceDetailPage({locale, slug}: {locale: Locale; slug: string}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages({locale}) as unknown as Messages;
  const service = messages.services.items.find((item) => item.slug === slug) ?? messages.services.items[0];

  return (
    <section className="container-grid min-h-screen pb-24 pt-32">
      <p className="font-mono text-eyebrow uppercase tracking-[0.2em] text-accent">{messages.services.detailFallback}</p>
      <h1 className="mt-5 max-w-3xl font-display text-display-m font-medium text-fg-primary">{service.title}</h1>
      <p className="mt-5 max-w-2xl text-body-l text-fg-secondary">{service.text}</p>
      <Link href="/quote" className="mt-10 inline-flex h-12 items-center bg-accent px-7 text-sm font-semibold text-bg-dark">{messages.services.quoteCta}</Link>
    </section>
  );
}
