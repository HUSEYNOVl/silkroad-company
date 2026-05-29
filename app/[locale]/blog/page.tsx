import {getMessages, getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {Link} from '@/lib/navigation';
import type {Locale} from '@/lib/navigation';

type Post = {slug: string; title: string; excerpt: string};
type Messages = {blog: {posts: Post[]}};

export default async function BlogPage({params}: {params: {locale: Locale}}) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations('blog');
  const messages = await getMessages({locale: params.locale}) as unknown as Messages;

  return (
    <section className="container-grid pb-24 pt-32">
      <h1 className="font-display text-display-m font-medium text-fg-primary">{t('title')}</h1>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {messages.blog.posts.map((post) => (
          <Link key={post.slug} href={{pathname: '/blog/[slug]', params: {slug: post.slug}}} className="border border-border bg-bg-primary p-7">
            <h2 className="font-display text-2xl text-fg-primary">{post.title}</h2>
            <p className="mt-3 text-sm text-fg-secondary">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
