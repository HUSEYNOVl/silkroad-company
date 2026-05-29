import {getMessages, getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import Image from 'next/image';
import {Link} from '@/lib/navigation';
import type {Locale} from '@/lib/navigation';

type Category = {name: string; slug: string; image: string};
type Messages = {home: {categories: {items: Category[]}}};

export default async function CategoriesPage({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('categories');
  const messages = await getMessages({locale: params.locale}) as unknown as Messages;

  return (
    <section className="container-grid pb-24 pt-32">
      <h1 className="font-display text-display-m font-medium text-fg-primary">{t('title')}</h1>
      <p className="mt-4 max-w-2xl text-fg-secondary">{t('text')}</p>
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {messages.home.categories.items.map((item) => (
          <Link key={item.slug} href={{pathname: '/categories/[category]', params: {category: item.slug}}} className="group relative aspect-square overflow-hidden bg-bg-dark">
            <Image src={item.image} alt={item.name} fill className="object-cover transition-transform group-hover:scale-[1.02]" sizes="(min-width:1024px) 16vw, 50vw" />
            <span className="absolute inset-0 bg-bg-dark/55" />
            <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-sm font-semibold text-white">{item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
