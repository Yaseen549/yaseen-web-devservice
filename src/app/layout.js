// app/layout.js
import './globals.css';
import { Inter, Outfit, Pacifico } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const pacifico = Pacifico({ subsets: ['latin'], weight: '400', variable: '--font-pacifico' });

export const metadata = {
  title: "Yaseen's Mock Studio - Premium Web Development & Design",
  description: "Crafting beautiful, modern web experiences using Next.js, Supabase, and Vercel.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${outfit.variable} ${pacifico.variable}`}>
        <body className="bg-black text-gray-100 font-outfit">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
