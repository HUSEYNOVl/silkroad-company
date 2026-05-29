import {getTranslations} from 'next-intl/server';
import {Link} from '@/lib/navigation';
import {LanguageSwitcher} from './LanguageSwitcher';

export async function Footer() {
  const t = await getTranslations('footer');
  const whatsappHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? ''}`;

  return (
    <footer className="border-t border-border bg-bg-primary">
      {/* Top band */}
      <div className="container-grid py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand block */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="block h-5 w-5 rounded-sm bg-accent" />
              <p className="font-display text-lg font-semibold text-fg-primary">{t('mark')}</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-secondary">
              {t('description')}
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={whatsappHref}
                className="inline-flex h-9 items-center border border-border-strong px-4 text-xs font-semibold text-fg-secondary transition-colors hover:border-accent hover:text-accent"
              >
                {t('whatsapp')}
              </a>
              <a
                href="mailto:hello@sarkhan.com"
                className="inline-flex h-9 items-center border border-border-strong px-4 text-xs font-semibold text-fg-secondary transition-colors hover:border-accent hover:text-accent"
              >
                {t('emailLabel')}
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            <FooterColumn
              title={t('company')}
              items={[
                ['/about',   t('about')],
                ['/contact', t('contact')]
              ]}
            />
            <FooterColumn
              title={t('services')}
              items={[
                ['/services#service-1', t('sourcing')],
                ['/services#service-5', t('shipping')],
                ['/services#service-6', t('customs')]
              ]}
            />
            <div>
              <h2 className="font-mono text-caption font-medium uppercase tracking-[0.15em] text-fg-tertiary">
                {t('contact')}
              </h2>
              <div className="mt-5 grid gap-3 text-sm text-fg-secondary">
                <a href="mailto:hello@sarkhan.com" className="transition-colors hover:text-accent">
                  {t('email')}
                </a>
                <a href={whatsappHref} className="transition-colors hover:text-accent">
                  {t('whatsapp')}
                </a>
                <p>{t('address')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-grid flex flex-col gap-4 py-6 text-xs text-fg-tertiary md:flex-row md:items-center md:justify-between">
          <p>{t('copyright')}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-fg-primary">{t('privacy')}</Link>
            <Link href="/terms" className="transition-colors hover:text-fg-primary">{t('terms')}</Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({title, items}: {title: string; items: Array<[string, string]>}) {
  const FooterLink = Link as unknown as (props: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => JSX.Element;

  return (
    <div>
      <h2 className="font-mono text-caption font-medium uppercase tracking-[0.15em] text-fg-tertiary">
        {title}
      </h2>
      <div className="mt-5 grid gap-3 text-sm text-fg-secondary">
        {items.map(([href, label]) => (
          <FooterLink
            key={`${href}-${label}`}
            href={href}
            className="transition-colors hover:text-accent"
          >
            {label}
          </FooterLink>
        ))}
      </div>
    </div>
  );
}
