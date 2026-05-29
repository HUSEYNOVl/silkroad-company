'use client';

import {useMessages, useTranslations} from 'next-intl';
import {Gauge, Handshake, Timer} from 'lucide-react';
import {motion} from 'framer-motion';
import {Eyebrow, Section, SectionHeading} from '@/components/ui/Section';
import {MediaFrame} from '@/components/ui/MediaFrame';
import {fadeUp} from '@/lib/motion';

type Messages = {
  about: {
    story: string[];
    values: Array<[string, string]>;
    strip: {email: string; whatsapp: string; address: string};
  };
};

const icons = [Handshake, Timer, Gauge];

export function AboutContent() {
  const t = useTranslations('about');
  const messages = useMessages() as unknown as Messages;
  const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? '';

  return (
    <>
      {/* Hero */}
      <section className="container-grid grid min-h-[90vh] items-end gap-12 pb-24 pt-32 lg:grid-cols-[0.85fr_1.15fr] lg:pb-28">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:pb-16">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mt-5 font-display text-display-m font-medium text-fg-primary">
            {t('name')}
          </h1>
          <p className="mt-5 max-w-md text-body-l leading-relaxed text-fg-secondary">{t('intro')}</p>
          <div className="mt-10 h-px w-12 bg-accent" />
        </motion.div>
        <MediaFrame
          src="/images/portrait.jpg"
          alt={t('name')}
          priority
          className="h-[68vh] min-h-[480px]"
        />
      </section>

      {/* Story */}
      <Section className="bg-bg-secondary">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <Eyebrow>{t('storyEyebrow')}</Eyebrow>
            <SectionHeading>{t('storyTitle')}</SectionHeading>
          </div>
          <div className="grid gap-5 text-body-l leading-relaxed text-fg-secondary">
            {messages.about.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section>
        <Eyebrow>{t('valuesEyebrow')}</Eyebrow>
        <SectionHeading>{t('valuesHeading')}</SectionHeading>
        <div className="mt-14 grid gap-px overflow-hidden border border-border-strong bg-border-strong md:grid-cols-3">
          {messages.about.values.map(([title, text], index) => {
            const Icon = icons[index];
            return (
              <article
                key={title}
                className="group bg-bg-primary p-8 transition-all duration-300 hover:bg-bg-secondary"
              >
                <div className="mb-6 inline-flex h-11 w-11 items-center justify-center border border-border bg-bg-secondary transition-colors group-hover:border-accent group-hover:bg-accent-subtle">
                  <Icon className="h-5 w-5 text-accent" aria-hidden />
                </div>
                <h3 className="text-h3 font-semibold text-fg-primary">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-secondary">{text}</p>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Contact strip */}
      <section className="border-y border-border bg-bg-secondary py-10">
        <div className="container-grid grid gap-6 text-sm text-fg-secondary md:grid-cols-3">
          <a href={`mailto:${messages.about.strip.email}`} className="font-medium transition-colors hover:text-accent">
            {messages.about.strip.email}
          </a>
          <a href={`https://wa.me/${WA}`} className="font-medium transition-colors hover:text-accent">
            {messages.about.strip.whatsapp}
          </a>
          <p>{messages.about.strip.address}</p>
        </div>
      </section>
    </>
  );
}
