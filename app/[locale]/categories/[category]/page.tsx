import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {Link} from '@/lib/navigation';
import type {Locale} from '@/lib/navigation';

export default async function CategoryPage({params}: {params: {locale: Locale; category: string}}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('categories');

  return (
    <section className="container-grid min-h-screen pb-24 pt-32">
      <p className="font-mono text-eyebrow uppercase tracking-[0.2em] text-accent">{t('eyebrow')}</p>
      <h1 className="mt-5 font-display text-display-m font-medium text-fg-primary">{params.category.replace(/-/g, ' ')}</h1>
      <p className="mt-4 max-w-2xl text-fg-secondary">{t('detailText')}</p>
      <Link href="/quote" className="mt-10 inline-flex h-12 items-center bg-accent px-7 text-sm font-semibold text-bg-dark">{t('quoteCta')}</Link>
    </section>
  );
}
