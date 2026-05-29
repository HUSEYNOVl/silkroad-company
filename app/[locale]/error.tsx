'use client';

import {useEffect} from 'react';

export default function Error({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-grid flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <h2 className="font-display text-3xl font-medium text-fg-primary">Something went wrong</h2>
      <p className="max-w-md text-fg-secondary">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="h-11 bg-accent px-8 text-sm font-semibold text-bg-dark"
      >
        Try again
      </button>
    </div>
  );
}
