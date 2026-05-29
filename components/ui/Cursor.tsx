'use client';

import {useRef} from 'react';
import {motion, useMotionValue, useSpring} from 'framer-motion';

export function Magnetic({
  children,
  strength = 0.35
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, {stiffness: 300, damping: 25});
  const sy = useSpring(y, {stiffness: 300, damping: 25});

  function handleMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{x: sx, y: sy}}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}
