import {Bot} from 'lucide-react';
import {motion} from 'framer-motion';
import Image from 'next/image';
import type {ChatMessage} from '@/hooks/useChat';

export function MessageBubble({message}: {message: ChatMessage}) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{opacity: 0, y: 6}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.18}}
        className="flex justify-end"
      >
        <div className="max-w-[78%] space-y-2">
          {message.content_type === 'image' && message.imageUrl && (
            <div className="overflow-hidden rounded-2xl rounded-br-sm">
              <Image
                src={message.imageUrl}
                alt="Uploaded product"
                width={240}
                height={180}
                className="h-auto w-full max-w-[240px] object-cover"
                unoptimized
              />
            </div>
          )}
          {message.content && message.content !== 'Sent an image for analysis' && (
            <div className="rounded-2xl rounded-br-sm bg-fg-primary px-4 py-3 text-sm leading-relaxed text-white">
              {message.content}
            </div>
          )}
          {message.content_type === 'image' && message.content === 'Sent an image for analysis' && null}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 6}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.18}}
      className="flex gap-3"
    >
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle">
        <Bot className="h-3.5 w-3.5 text-accent" aria-hidden />
      </div>
      <div className="flex-1 pt-0.5 text-sm leading-relaxed text-fg-primary">
        {message.content || <span className="text-fg-tertiary">…</span>}
      </div>
    </motion.div>
  );
}
