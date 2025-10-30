/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wv-bg': '#F5F7FA',
        'wv-primary': '#4F46E5',
        'wv-text': '#1F2937',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        outfit: ['var(--font-outfit)'],
        pacifico: ['var(--font-pacifico)'],
      },
      boxShadow: {
        'clay-outer': '6px 6px 12px rgba(121, 128, 140, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.8)',
        'clay-inner': 'inset 3px 3px 6px rgba(121, 128, 140, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.6)',
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
