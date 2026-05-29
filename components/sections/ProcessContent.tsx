'use client';

import {useMessages, useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {MediaFrame} from '@/components/ui/MediaFrame';
import {FinalCta} from '@/components/sections/FinalCta';
import {Eyebrow} from '@/components/ui/Section';
import {fadeUp, viewport} from '@/lib/motion';

type Messages = {
  process: {
    steps: Array<[string, string]>;
  };
};

export function ProcessContent() {
  const t = useTranslations('process');
  const messages = useMessages() as unknown as Messages;

  return (
    <>
      {/* Hero */}
      <section className="bg-bg-secondary">
        <div className="container-grid flex min-h-[50vh] items-end pb-24 pt-32 md:pb-28">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Eyebrow>{t('heroEyebrow')}</Eyebrow>
            <h1 className="mt-5 max-w-3xl font-display text-display-l font-medium text-fg-primary">
              {t('heroTitle')}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="container-grid py-24 md:py-32">
        <div className="grid gap-0">
          {messages.process.steps.map(([title, text], index) => (
            <motion.article
              key={title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="group grid gap-8 border-t border-border py-12 md:grid-cols-[120px_1fr] md:gap-16 md:py-16 lg:grid-cols-[180px_1fr_0.8fr]"
            >
              {/* Number */}
              <div className="flex items-start">
                <p className="font-mono text-5xl font-medium text-accent/25 transition-colors duration-300 group-hover:text-accent/60">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </div>

              {/* Content */}
              <div className="self-center">
                <h2 className="font-display text-h1 font-semibold text-fg-primary">{title}</h2>
                <p className="mt-4 max-w-md text-body leading-relaxed text-fg-secondary">{text}</p>
              </div>

              <MediaFrame
                src={`/images/process-${index + 1}.jpg`}
                alt={title}
                className="aspect-[16/11] lg:block"
              />
            </motion.article>
          ))}
          <div className="border-t border-border" />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
