import type {Config} from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT:   'var(--bg-primary)',
          primary:   'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          elevated:  'var(--bg-elevated)',
          dark:      'var(--bg-dark)'
        },
        fg: {
          DEFAULT:   'var(--fg-primary)',
          primary:   'var(--fg-primary)',
          secondary: 'var(--fg-secondary)',
          tertiary:  'var(--fg-tertiary)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          subtle:  'var(--accent-subtle)'
        },
        navy: {
          DEFAULT: 'var(--navy)',
          hover: 'var(--navy-hover)'
        },
        border: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans:    ['var(--font-sans)',    'sans-serif'],
        body:    ['var(--font-sans)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace']
      },
      fontSize: {
        'display-xl': ['clamp(3rem,7vw,5rem)',   {lineHeight: '1.04', letterSpacing: '-0.04em'}],
        'display-l':  ['clamp(2.25rem,5vw,3.75rem)', {lineHeight: '1.05', letterSpacing: '-0.035em'}],
        'display-m':  ['clamp(1.75rem,3.5vw,2.75rem)', {lineHeight: '1.1', letterSpacing: '-0.03em'}],
        h1:           ['clamp(1.75rem,3vw,2.25rem)', {lineHeight: '1.15', letterSpacing: '-0.025em'}],
        h2:           ['clamp(1.375rem,2.5vw,1.75rem)', {lineHeight: '1.2', letterSpacing: '-0.02em'}],
        h3:           ['1.25rem',  {lineHeight: '1.25'}],
        'body-l':     ['1.125rem', {lineHeight: '1.65'}],
        body:         ['1rem',     {lineHeight: '1.65'}],
        caption:      ['0.8125rem',{lineHeight: '1.5'}],
        eyebrow:      ['0.6875rem',{lineHeight: '1.4', letterSpacing: '0.2em'}]
      },
      maxWidth: {
        content: '1280px',
        text:    '640px'
      },
      spacing: {
        section:        '7rem',
        'section-mobile': '4.5rem'
      },
      borderRadius: {
        button: '6px',
        media:  '6px'
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      boxShadow: {
        'card':   '0 2px 16px rgba(26,26,46,0.06)',
        'card-hover': '0 8px 28px rgba(26,26,46,0.10)',
        'accent': '0 0 0 3px var(--accent-subtle)'
      }
    }
  },
  plugins: []
};

export default config;
