import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary backgrounds (soft, neutral dark — easy on the eyes)
        'page-bg': '#191b21',
        'card-bg': '#20232b',
        'card-border': '#2d313b',
        // Subtle table header instead of a bright, glaring fill
        'table-header': '#272b34',
        'table-header-text': '#cbd0db',
        // Nav
        'nav-bg': '#1c1f26',
        'nav-border': '#2d313b',
        'nav-text': '#aab0bd',
        'nav-active': '#8e84d4',
        // Text colors (off-white, not harsh pure white)
        'text-primary': '#e6e8ee',
        'text-secondary': '#a3a9b7',
        'text-muted': '#737a89',
        'text-link': '#a79ee8',
        // Accent colors (muted/desaturated so nothing screams)
        'accent-primary': '#8e84d4',
        'accent-purple': '#9a90db',
        'accent-purple-light': '#b4ace7',
        'accent-green': '#6cbf95',
        'accent-orange': '#d6a06a',
        'accent-blue': '#79a3d4',
        'accent-red': '#d98a8a',
        // Buttons
        'btn-primary': '#8e84d4',
        'btn-danger': '#c47b6b',
        'btn-success': '#6cbf95',
        // Input/form colors
        'input-bg': '#272a32',
        'input-border': '#3a3e48',
        'input-focus': '#8e84d4',
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
