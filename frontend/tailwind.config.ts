import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary backgrounds (dark purple theme)
        'page-bg': '#0f0c1a',
        'card-bg': '#1a1530',
        'card-border': '#2e2745',
        'table-header': '#9333ea',
        'table-header-text': '#ffffff',
        // Nav
        'nav-bg': '#15101f',
        'nav-border': '#2e2745',
        'nav-text': '#c4b5e0',
        'nav-active': '#9333ea',
        // Text colors
        'text-primary': '#f1edf9',
        'text-secondary': '#b3a9c9',
        'text-muted': '#8b8299',
        'text-link': '#c084fc',
        // Accent colors (purple to match login page)
        'accent-primary': '#9333ea',
        'accent-purple': '#a855f7',
        'accent-purple-light': '#c084fc',
        'accent-green': '#22c55e',
        'accent-orange': '#fb923c',
        'accent-blue': '#60a5fa',
        'accent-red': '#f87171',
        // Buttons
        'btn-primary': '#9333ea',
        'btn-danger': '#ea580c',
        'btn-success': '#22c55e',
        // Input/form colors
        'input-bg': '#221b33',
        'input-border': '#3b3450',
        'input-focus': '#9333ea',
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
