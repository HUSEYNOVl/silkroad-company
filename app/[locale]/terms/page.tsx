import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/lib/navigation';

export default async function TermsPage({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('termsPage');

  return (
    <section className="container-grid flex min-h-screen items-center justify-center py-32 text-center">
      <div>
        <h1 className="font-display text-display-m font-medium text-fg-primary">{t('title')}</h1>
        <p className="mt-4 text-body-l text-fg-secondary">{t('text')}</p>
      </div>
    </section>
  );
}
