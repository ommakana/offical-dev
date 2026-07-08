/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        surface: {
          // CSS-variable references — rgb() channel pattern so Tailwind opacity
          // modifiers like bg-surface/90 keep working (e.g. header glassmorphism)
          DEFAULT: 'rgb(var(--surface-rgb) / <alpha-value>)',
          card:    'rgb(var(--surface-card-rgb) / <alpha-value>)',
          hover:   'rgb(var(--surface-hover-rgb) / <alpha-value>)',
          border:  'rgb(var(--surface-border-rgb) / <alpha-value>)',
        },
        accent: {
          hn: '#ff6600',
          devto: '#3b49df',
          reddit: '#ff4500',
          github: '#6e40c9',
          devops: '#0db7ed',
          ai: '#10b981',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
