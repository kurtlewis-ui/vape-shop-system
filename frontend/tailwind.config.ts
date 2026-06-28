import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary backgrounds (deep, cool — comfortable but with a bit more depth)
        'page-bg': '#15161d',
        'card-bg': '#1d1f29',
        'card-border': '#2b2e3a',
        // Subtle table header (kept calm so big areas never glare)
        'table-header': '#242732',
        'table-header-text': '#cdd2dd',
        // Nav
        'nav-bg': '#181a22',
        'nav-border': '#2b2e3a',
        'nav-text': '#aab0bd',
        'nav-active': '#7c6cf5',
        // Text colors (off-white, not harsh pure white)
        'text-primary': '#eceef4',
        'text-secondary': '#a6acbb',
        'text-muted': '#727988',
        'text-link': '#a78bfa',
        // Accent colors (vibrant but tasteful — used sparingly for life)
        'accent-primary': '#7c6cf5',
        'accent-purple': '#a78bfa',
        'accent-purple-light': '#c4b5fd',
        'accent-pink': '#f472b6',
        'accent-cyan': '#2dd4bf',
        'accent-green': '#34d399',
        'accent-orange': '#fb9a4b',
        'accent-blue': '#60a5fa',
        'accent-red': '#f87171',
        // Buttons
        'btn-primary': '#7c6cf5',
        'btn-danger': '#ef6b5c',
        'btn-success': '#34d399',
        // Input/form colors
        'input-bg': '#23262f',
        'input-border': '#363a46',
        'input-focus': '#7c6cf5',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
