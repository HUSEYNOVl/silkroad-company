import type {Variants} from 'framer-motion';

export const silkEase = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: {opacity: 0, y: 40},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.7, ease: silkEase}
  }
};

export const fadeIn: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {duration: 0.6}
  }
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const viewport = {once: true, amount: 0.15};
