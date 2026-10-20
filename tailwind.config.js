/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        iron: {
          deep: '#161c1c',
          DEFAULT: '#222a2a',
          card: '#263030',
        },
        aqua: '#4FBBBC',
        rust: '#EC4624',
        heat: '#F39120',
        cream: '#E2DAC2',
        muted: '#c9c0a6',
        faint: '#6b6b5c',
        border: '#33403f',
        surface: '#1a2121',
      },
      borderRadius: {
        xl: '32px',
        '2xl': '28px',
        full: '9999px',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', '"SF Mono"', 'monospace'],
      },
      fontSize: {
        'tnum': ['0.875rem', { fontVariationSettings: '"tnum" on' }],
      },
    },
  },
  plugins: [],
}