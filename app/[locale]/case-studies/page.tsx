import {getMessages, getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {Link} from '@/lib/navigation';
import type {Locale} from '@/lib/navigation';

type CaseStudy = {tag: string; destination: string; title: string; href: string};
type Messages = {home: {caseStudies: {items: CaseStudy[]}}};

export default async function CaseStudiesPage({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('caseStudies');
  const messages = await getMessages({locale: params.locale}) as unknown as Messages;

  return (
    <section className="container-grid pb-24 pt-32">
      <h1 className="font-display text-display-m font-medium text-fg-primary">{t('title')}</h1>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {messages.home.caseStudies.items.map((item) => (
          <Link key={item.href} href={{pathname: '/case-studies/[slug]', params: {slug: item.href.split('/').pop() ?? item.href}}} className="border border-border bg-bg-primary p-7 transition-all hover:-translate-y-1 hover:shadow-card">
            <p className="font-mono text-xs uppercase text-accent">{item.tag}</p>
            <p className="mt-3 text-sm text-fg-tertiary">{item.destination}</p>
            <h2 className="mt-5 font-display text-2xl text-fg-primary">{item.title}</h2>
          </Link>
        ))}
      </div>
    </section>
  );
}
