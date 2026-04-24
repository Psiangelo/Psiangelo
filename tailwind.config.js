/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0E0C0A',
          warm: '#131110',
          card: '#1A1714',
          'card-hover': '#221F19',
        },
        border: {
          subtle: 'rgba(180, 140, 80, 0.1)',
          hover: 'rgba(180, 140, 80, 0.22)',
        },
        text: {
          DEFAULT: '#B8AD9E',
          // #8C8378 passa WCAG AA (5.2:1 sobre #0E0C0A); #6E6458 antigo dava só ~3.4:1
          dim: '#8C8378',
          bright: '#E8DDD0',
        },
        accent: {
          DEFAULT: '#B48C50',
          soft: '#9A7A48',
          bright: '#D4A853',
        },
        nigredo: '#1C1410',
        albedo: '#E8DDD0',
        citrinit: '#D4A853',
        rubedo: '#8B3A2E',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"Libre Baskerville"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Courier Prime"', 'monospace'],
      },
    },
  },
  plugins: [],
};
