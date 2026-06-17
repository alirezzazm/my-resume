import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // CSS variables از next/font/local (در src/lib/fonts.ts)
        sans: ['var(--font-en)', 'var(--font-fa)', 'system-ui', 'sans-serif'],
        fa:   ['var(--font-fa)', 'Tahoma', 'sans-serif'],
        en:   ['var(--font-en)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Programming theme — purple/violet primary (matches resume)
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Code editor accent — neon green / cyan
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Code syntax-highlight palette
        code: {
          bg: '#0d1117',
          panel: '#161b22',
          line: '#21262d',
          comment: '#8b949e',
          keyword: '#ff7b72',     // pink-red
          string: '#a5d6ff',      // light blue
          function: '#d2a8ff',    // violet
          variable: '#79c0ff',    // cyan
          number: '#f78166',      // orange
          tag: '#7ee787',         // green
          attribute: '#79c0ff',
          plain: '#c9d1d9',
        },
      },
      backgroundImage: {
        'grid-dark': "linear-gradient(rgba(124,58,237,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.1) 1px, transparent 1px)",
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139,92,246,0.6)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'gradient-x': 'gradient-x 6s ease infinite',
        'float': 'float 4s ease-in-out infinite',
        'blink': 'blink 1s steps(2, start) infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
