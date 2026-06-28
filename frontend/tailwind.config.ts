import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary backgrounds (soft, lifted dark — easier on the eyes than near-black)
        'page-bg': '#1b1d24',
        'card-bg': '#242732',
        'card-border': '#343845',
        // Subtle table header
        'table-header': '#2c303b',
        'table-header-text': '#d3d8e2',
        // Nav
        'nav-bg': '#21242e',
        'nav-border': '#343845',
        'nav-text': '#b6bcca',
        'nav-active': '#8b7df7',
        // Text colors (a touch brighter for clarity)
        'text-primary': '#f1f3f8',
        'text-secondary': '#b4bac8',
        'text-muted': '#828a99',
        'text-link': '#b3a4fb',
        // Accent colors — purple-led; others kept only for the small status dots
        'accent-primary': '#8b7df7',
        'accent-purple': '#a78bfa',
        'accent-purple-light': '#c4b5fd',
        'accent-pink': '#f472b6',
        'accent-cyan': '#2dd4bf',
        'accent-green': '#3fbf8f',
        'accent-orange': '#e0a35e',
        'accent-blue': '#6f9be0',
        'accent-red': '#ea6a62',
        // Neutral surface for badges/hover (replaces the old white/x guesses)
        'surface-muted': '#2e323d',
        // Buttons (purple primary, red kept for destructive)
        'btn-primary': '#8b7df7',
        'btn-danger': '#e5675e',
        'btn-success': '#3fbf8f',
        // Input/form colors
        'input-bg': '#272a35',
        'input-border': '#3b3f4d',
        'input-focus': '#8b7df7',
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
