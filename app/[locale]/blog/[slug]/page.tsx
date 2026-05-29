import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/lib/navigation';

export default async function BlogPostPage({params}: {params: {locale: Locale; slug: string}}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('blog');

  return (
    <article className="container-grid min-h-screen pb-24 pt-32">
      <p className="font-mono text-eyebrow uppercase tracking-[0.2em] text-accent">{t('eyebrow')}</p>
      <h1 className="mt-5 font-display text-display-m font-medium text-fg-primary">{params.slug.replace(/-/g, ' ')}</h1>
      <p className="mt-4 max-w-2xl text-fg-secondary">{t('detailText')}</p>
    </article>
  );
}
