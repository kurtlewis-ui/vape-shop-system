import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Dark theme backgrounds
        'dark-bg': '#0f1120',
        'dark-card': '#1a1f37',
        'dark-card-hover': '#1e2a4a',
        'dark-sidebar': '#131627',
        'dark-border': 'rgba(255, 255, 255, 0.06)',
        // Text colors
        'text-primary': '#ffffff',
        'text-secondary': '#8b8fa3',
        'text-muted': '#6b7080',
        // Accent colors
        'accent-purple': '#7c3aed',
        'accent-purple-light': '#a78bfa',
        'accent-green': '#4ade80',
        'accent-orange': '#fb923c',
        'accent-blue': '#38bdf8',
        'accent-pink': '#f472b6',
        'accent-red': '#ef4444',
        // Input/form colors
        'input-bg': '#252d4a',
        'input-border': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
        'gradient-card': 'linear-gradient(135deg, #1e2a4a 0%, #1a1f37 100%)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
