import type {AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode} from 'react';
import {cn} from '@/lib/utils';

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
  className?: string;
};

const styles = {
  primary:   'bg-accent text-bg-primary border border-accent hover:bg-accent-hover hover:border-accent-hover',
  secondary: 'border border-accent text-accent hover:bg-accent hover:text-bg-primary',
  ghost:     'border border-border-strong text-fg-secondary hover:border-fg-primary hover:text-fg-primary'
};

const base =
  'relative inline-flex min-h-[44px] items-center justify-center gap-2 px-6 text-sm font-semibold tracking-wide transition-all duration-200 ease-silk disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2';

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...props
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, styles[variant], className)} {...props}>
      {children}
    </a>
  );
}
