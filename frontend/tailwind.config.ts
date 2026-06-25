import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary backgrounds (white/light theme)
        'page-bg': '#f8f9fc',
        'card-bg': '#ffffff',
        'card-border': '#e5e7eb',
        'table-header': '#6b1c2a',
        'table-header-text': '#ffffff',
        // Nav
        'nav-bg': '#ffffff',
        'nav-border': '#e5e7eb',
        'nav-text': '#374151',
        'nav-active': '#6b1c2a',
        // Text colors
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'text-muted': '#9ca3af',
        'text-link': '#1e40af',
        // Accent colors (from login page)
        'accent-primary': '#6b1c2a',
        'accent-purple': '#7c3aed',
        'accent-purple-light': '#a78bfa',
        'accent-green': '#16a34a',
        'accent-orange': '#ea580c',
        'accent-blue': '#2563eb',
        'accent-red': '#dc2626',
        // Buttons
        'btn-primary': '#1e3a5f',
        'btn-danger': '#ea580c',
        'btn-success': '#16a34a',
        // Input/form colors
        'input-bg': '#ffffff',
        'input-border': '#d1d5db',
        'input-focus': '#6b1c2a',
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
