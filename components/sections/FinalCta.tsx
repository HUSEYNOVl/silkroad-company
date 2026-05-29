'use client';

import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {Link} from '@/lib/navigation';
import {ButtonLink} from '@/components/ui/Button';
import {fadeUp, viewport} from '@/lib/motion';
import {TextReveal} from '@/components/ui/TextReveal';

export function FinalCta() {
  const t = useTranslations('common');
  const WA = process.env.NEXT_PUBLIC_WHATSAPP ?? '';

  return (
    <section className="relative overflow-hidden bg-bg-dark py-28 md:py-40">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="container-grid relative text-center"
      >
        <p className="font-mono text-eyebrow uppercase tracking-[0.2em] text-accent">
          {t('readyEyebrow')}
        </p>
        <TextReveal
          text={t('finalTitle')}
          as="h2"
          className="mx-auto mt-5 max-w-2xl justify-center font-display text-display-l font-medium text-bg-primary"
        />
        <p className="mx-auto mt-5 max-w-md text-body-l text-bg-primary/60">
          {t('finalText')}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
              href="/contact"
              className="inline-flex h-12 items-center border border-accent bg-accent px-7 text-sm font-semibold tracking-wide text-bg-primary transition-colors hover:bg-accent-hover"
            >
              {t('sendRequest')} →
          </Link>
          <ButtonLink
              href={`https://wa.me/${WA}`}
              variant="ghost"
              className="border-bg-primary/20 text-bg-primary/80 hover:border-bg-primary/50 hover:bg-transparent hover:text-bg-primary"
            >
              {t('whatsapp')}
          </ButtonLink>
        </div>
      </motion.div>
    </section>
  );
}
