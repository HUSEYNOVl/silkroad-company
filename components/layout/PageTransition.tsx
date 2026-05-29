'use client';

import {motion, AnimatePresence} from 'framer-motion';
import {usePathname} from 'next/navigation';

const variants = {
  initial: {opacity: 0, y: 12},
  enter:   {opacity: 1, y: 0,  transition: {duration: 0.45, ease: [0.22, 1, 0.36, 1]}},
  exit:    {opacity: 0, y: -8, transition: {duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
};

/* Curtain overlay that sweeps on route change */
const curtainVariants = {
  initial: {scaleY: 0, originY: 0},
  enter:   {scaleY: 0, originY: 0, transition: {duration: 0}},
  exit:    {scaleY: [0, 1, 1, 0], originY: ['0%', '0%', '100%', '100%'], transition: {duration: 0.7, times: [0, 0.35, 0.65, 1], ease: 'easeInOut'}}
};

export function PageTransition({children}: {children: React.ReactNode}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {/* Accent curtain sweep */}
        <motion.div
          key={`curtain-${pathname}`}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[200] bg-accent"
          variants={curtainVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
