'use client';

import type {ReactNode} from 'react';
import {motion} from 'framer-motion';
import {fadeUp, viewport} from '@/lib/motion';
import {cn} from '@/lib/utils';

export function Section({
  children,
  className,
  innerClassName
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section className={cn('py-24 md:py-32', className)}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className={cn('container-grid', innerClassName)}
      >
        {children}
      </motion.div>
    </section>
  );
}

export function Eyebrow({children, className}: {children: ReactNode; className?: string}) {
  return (
    <p className={cn('font-mono text-eyebrow font-medium uppercase tracking-[0.2em] text-accent', className)}>
      {children}
    </p>
  );
}

export function SectionHeading({children, className}: {children: ReactNode; className?: string}) {
  return (
    <h2 className={cn('mt-4 font-display text-display-m font-medium text-fg-primary', className)}>
      {children}
    </h2>
  );
}
