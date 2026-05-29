import {Bot} from 'lucide-react';
import {motion} from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle">
        <Bot className="h-3.5 w-3.5 text-accent" aria-hidden />
      </div>
      <div className="flex items-center gap-1 pt-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-fg-tertiary"
            animate={{scale: [1, 1.4, 1], opacity: [0.35, 1, 0.35]}}
            transition={{repeat: Infinity, duration: 1, delay: i * 0.2, ease: 'easeInOut'}}
          />
        ))}
      </div>
    </div>
  );
}
