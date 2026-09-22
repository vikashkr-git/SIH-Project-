/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F172A',
          dark: '#0B1120',
          cardDark: '#111827',
          borderDark: '#1E293B',
          slate: '#334155',
          teal: '#0F766E',
          tealLight: '#0D9488',
          tealMuted: '#14B8A6',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#0F172A',
          textSecondary: '#475569',
          textMuted: '#64748B',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
