// app/layout.js
import './globals.css';
import { Inter, Outfit, Pacifico } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const pacifico = Pacifico({ subsets: ['latin'], weight: '400', variable: '--font-pacifico' });

const isProd = process.env.NODE_ENV === 'production';
const siteUrl = 'https://yms.snippkit.com';

export const metadata = {
  title: "Yaseen's MockStudio - Premium Web Development & Design",
  description:
    "Yaseen's MockStudio crafts beautiful, high-performing websites, SaaS platforms, and digital experiences using Next.js, Supabase, and Vercel.",
  keywords: [
    "Yaseen's MockStudio",
    "web development",
    "web design",
    "Next.js",
    "Supabase",
    "Vercel",
    "SaaS",
    "frontend development",
    "modern websites",
  ],
  authors: [{ name: "Yaseen" }],
  creator: "Yaseen",
  openGraph: {
    title: "Yaseen's MockStudio - Premium Web Development & Design",
    description:
      "We craft stunning, high-performing web experiences and SaaS applications with Next.js, Supabase, and Vercel.",
    url: siteUrl,
    siteName: "Yaseen's MockStudio",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Yaseen's MockStudio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yaseen's MockStudio",
    description:
      "Crafting high-quality websites, SaaS, and digital experiences with Next.js, Supabase, and Vercel.",
    images: [`${siteUrl}/og-image.png`],
    site: "@Yaseen",
    creator: "@Yaseen",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${outfit.variable} ${pacifico.variable}`}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="canonical" href={siteUrl} />

          {/* Favicons: Light/Dark */}
          {isProd && (
            <>
              <link
                rel="icon"
                href="/favicon-light.ico"
                type="image/x-icon"
                media="(prefers-color-scheme: light)"
              />
              <link
                rel="icon"
                href="/favicon-dark.ico"
                type="image/x-icon"
                media="(prefers-color-scheme: dark)"
              />
            </>
          )}

          {/* SEO robots */}
          <meta name="robots" content={isProd ? "index, follow" : "noindex, nofollow"} />
        </head>
        <body className="bg-black text-gray-100 font-outfit">{children}</body>
      </html>
    </ClerkProvider>
  );
}
