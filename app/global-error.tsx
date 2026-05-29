'use client';

export default function GlobalError({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
  return (
    <html>
      <body>
        <div style={{padding: '2rem', fontFamily: 'monospace', textAlign: 'center'}}>
          <h2>Something went wrong</h2>
          <p style={{color: '#888'}}>{error.message}</p>
          <button onClick={reset} style={{marginTop: '1rem', padding: '0.5rem 1.5rem', cursor: 'pointer'}}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
