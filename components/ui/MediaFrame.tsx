import Image from 'next/image';
import {cn} from '@/lib/utils';

export function MediaFrame({
  src,
  alt,
  className,
  priority = false
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-bg-secondary ring-1 ring-border',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-silk hover:scale-[1.02]"
      />
    </div>
  );
}
