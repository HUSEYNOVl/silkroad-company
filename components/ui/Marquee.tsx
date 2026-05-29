'use client';

import {motion} from 'framer-motion';

const items = [
  'Sourcing',
  'Negotiation',
  'Quality Control',
  'Packaging',
  'Freight',
  'Customs Clearance',
  'Door Delivery',
  '500+ Shipments',
  '20+ Countries',
  '8 Years Experience'
];

function MarqueeTrack({speed = 40, reverse = false}: {speed?: number; reverse?: boolean}) {
  const doubled = [...items, ...items, ...items];
  const duration = items.length * speed;

  return (
    <div className="flex min-w-full shrink-0">
      <motion.div
        className="flex shrink-0 gap-0"
        animate={{x: reverse ? ['0%', '33.33%'] : ['0%', '-33.33%']}}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration,
          ease: 'linear'
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-6 px-8 font-mono text-eyebrow uppercase tracking-[0.2em]"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function MarqueeBanner() {
  return (
    <div className="overflow-hidden border-y border-border bg-bg-secondary py-5">
      <div className="flex">
        <MarqueeTrack speed={35} />
      </div>
    </div>
  );
}
