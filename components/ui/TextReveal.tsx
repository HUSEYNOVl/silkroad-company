'use client';

import {motion} from 'framer-motion';
import {cn} from '@/lib/utils';

const wordVariants = {
  hidden: {y: '110%', opacity: 0},
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.65,
      delay: i * 0.07,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

type Props = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  once?: boolean;
};

export function TextReveal({text, as: Tag = 'h2', className, once = true}: Props) {
  const words = text.split(' ');

  return (
    <Tag className={cn('flex flex-wrap gap-x-[0.3em] overflow-hidden', className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="overflow-hidden">
          <motion.span
            className="inline-block"
            variants={wordVariants}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{once, margin: '-10%'}}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* Char-by-char variant for shorter impact lines */
const charVariants = {
  hidden: {y: '110%', opacity: 0},
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.03,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export function CharReveal({text, as: Tag = 'h2', className, once = true}: Props) {
  return (
    <Tag className={cn('overflow-hidden', className)}>
      {text.split('').map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={charVariants}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{once, margin: '-10%'}}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
