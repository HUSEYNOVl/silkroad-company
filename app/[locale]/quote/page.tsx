import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {QuoteForm} from '@/components/sections/shared/QuoteForm';
import type {Locale} from '@/lib/navigation';

export default async function QuotePage({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('quote');

  return (
    <section className="container-grid grid min-h-screen gap-10 pb-24 pt-32 lg:grid-cols-[0.7fr_1.3fr]">
      <div>
        <p className="font-mono text-eyebrow uppercase tracking-[0.2em] text-accent">{t('eyebrow')}</p>
        <h1 className="mt-5 font-display text-display-m font-medium text-fg-primary">{t('title')}</h1>
        <p className="mt-4 text-body-l text-fg-secondary">{t('text')}</p>
      </div>
      <QuoteForm />
    </section>
  );
}
