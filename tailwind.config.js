/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wv-bg': '#F5F7FA',       // Soft Warm Background
        'wv-primary': '#4F46E5',  // Deep Indigo Accent
        'wv-text': '#1F2937',     // Dark Slate Text
      },
      fontFamily: {
        'inter': ['var(--font-inter)'],
        'outfit': ['var(--font-outfit)'],
      },
      // Custom shadows for Claymorphism and premium look
      boxShadow: {
        // Soft outer shadow for the pillowy effect
        'clay-outer': '6px 6px 12px rgba(121, 128, 140, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.8)',
        // Subtle inner shadow for perceived depth on recessed elements
        'clay-inner': 'inset 3px 3px 6px rgba(121, 128, 140, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.6)',
        // General shadow for headers and floating elements
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
