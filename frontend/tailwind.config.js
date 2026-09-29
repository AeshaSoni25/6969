/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--bg-page)',
        card: 'var(--bg-card)',
        sidebar: 'var(--bg-sidebar)',
        topbar: 'var(--bg-topbar)',
        subtle: 'var(--bg-subtle)',
        line: 'var(--border)',
        'nav-active': 'var(--bg-nav-active)',
        // shadcn/ui compatible
        background: 'var(--background)',
        popover: 'var(--popover)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      borderColor: {
        DEFAULT: 'var(--border)',
        line: 'var(--border)',
      },
    },
  },
  plugins: [],
};
