import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './services/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        brand: {
          navy: '#002147',
          blue: '#0056b3',
          action: '#0074d9',
          light: '#f0f7ff',
          slate: '#101828',
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
