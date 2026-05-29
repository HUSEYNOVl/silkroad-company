'use client';

import {useMessages, useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Check} from 'lucide-react';
import {MediaFrame} from '@/components/ui/MediaFrame';
import {Eyebrow, SectionHeading} from '@/components/ui/Section';
import {fadeUp, viewport} from '@/lib/motion';

type Messages = {
  services: {
    sections: Array<[string, string, string, string[]]>;
  };
};

export function ServicesContent() {
  const t = useTranslations('services');
  const messages = useMessages() as unknown as Messages;

  return (
    <>
      {/* Hero */}
      <section className="bg-bg-secondary">
        <div className="container-grid flex min-h-[55vh] flex-col justify-end pb-24 pt-32 md:pb-28">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Eyebrow>{t('heroEyebrow')}</Eyebrow>
            <h1 className="mt-5 max-w-3xl font-display text-display-l font-medium text-fg-primary">
              {t('heroTitle')}
            </h1>
            <p className="mt-5 max-w-md text-body-l text-fg-secondary">{t('heroText')}</p>
          </motion.div>
        </div>
      </section>

      {/* Services list + sticky nav */}
      <section className="container-grid grid gap-16 py-24 md:grid-cols-[1fr_200px] md:py-32">
        <div className="grid gap-28">
          {messages.services.sections.map(([eyebrow, title, text, bullets], index) => (
            <motion.article
              key={title}
              id={`service-${index + 1}`}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="grid gap-10 lg:grid-cols-2 lg:gap-20"
            >
              <MediaFrame
                src={`/images/service-${index + 1}.jpg`}
                alt={title}
                className={`aspect-[4/3] ${index % 2 ? 'lg:order-2' : ''}`}
              />
              <div className="self-center">
                <Eyebrow>{eyebrow}</Eyebrow>
                <h2 className="mt-4 font-display text-h1 font-semibold text-fg-primary">{title}</h2>
                <p className="mt-4 text-body leading-relaxed text-fg-secondary">{text}</p>
                <ul className="mt-8 grid gap-3">
                  {bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-fg-secondary">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-subtle">
                        <Check className="h-3 w-3 text-accent" aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Sticky sidebar nav */}
        <aside className="hidden md:block">
          <div className="sticky top-28 grid gap-2 border-l-2 border-border pl-5 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-5">
            <p className="mb-3 font-mono text-caption uppercase tracking-[0.15em] text-fg-tertiary">
              {t('sidebarLabel')}
            </p>
            {messages.services.sections.map(([, title], index) => (
              <a
                key={title}
                href={`#service-${index + 1}`}
                className="group flex items-center gap-2 text-xs text-fg-tertiary transition-colors hover:text-accent"
              >
                <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>
                <span className="truncate">{title}</span>
              </a>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}
