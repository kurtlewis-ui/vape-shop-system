import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary backgrounds (calm, minimalist dark)
        'page-bg': '#0b0b0f',
        'card-bg': '#141419',
        'card-border': '#26262f',
        // Table header is a subtle surface (not a loud purple bar)
        'table-header': '#1a1a21',
        'table-header-text': '#8a8a99',
        // Nav
        'nav-bg': '#101015',
        'nav-border': '#23232c',
        'nav-text': '#9a9aab',
        'nav-active': '#a78bfa',
        // Text colors (soft white, not harsh pure white)
        'text-primary': '#e6e6ec',
        'text-secondary': '#9a9aab',
        'text-muted': '#6a6a78',
        'text-link': '#a78bfa',
        // Accent colors (muted to be easy on the eyes)
        'accent-primary': '#8b5cf6',
        'accent-purple': '#a78bfa',
        'accent-purple-light': '#c4b5fd',
        'accent-green': '#4ade80',
        'accent-orange': '#e9974f',
        'accent-blue': '#7c9cc4',
        'accent-red': '#e07474',
        // Buttons
        'btn-primary': '#7c3aed',
        'btn-danger': '#c2410c',
        'btn-success': '#15803d',
        // Input/form colors
        'input-bg': '#16161d',
        'input-border': '#2a2a34',
        'input-focus': '#8b5cf6',
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
