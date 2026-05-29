'use client';

import {useEffect} from 'react';
import {motion, useMotionValue, useSpring} from 'framer-motion';
// Lenis smooth-scroll removed — native scroll is faster and has no input lag

export function SmoothScroll({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}

/* Thin accent progress bar pinned to top of viewport */
export function ScrollProgressBar() {
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, {stiffness: 400, damping: 40});

  useEffect(() => {
    function update() {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      rawProgress.set(total > 0 ? scrolled / total : 0);
    }
    window.addEventListener('scroll', update, {passive: true});
    update();
    return () => window.removeEventListener('scroll', update);
  }, [rawProgress]);

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[100] h-[2px] origin-left bg-accent"
      style={{scaleX: progress}}
    />
  );
}
