import './globals.css';
import { Inter, Outfit } from 'next/font/google';

// Load fonts and define CSS variables for use in tailwind.config.js
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: 'WebVibe Studio - Premium Web Development & Design',
  description: 'Crafting beautiful, modern web experiences using Next.js, Supabase, and Vercel. Minimalist design, maximal performance.',
};

export default function RootLayout({ children }) {
  // Attach font variables to the <html> tag
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
