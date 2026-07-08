import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// next/font serves Inter locally through Vercel edge — zero external request,
// zero render-blocking, font-display:swap baked in automatically.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Official Dev',
  description: 'Your curated dev news, sport news, jobs and more — in one place.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f1117',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to news API origins — fetches start before JS finishes */}
        <link rel="preconnect" href="https://hacker-news.firebaseio.com" />
        <link rel="preconnect" href="https://dev.to" />
        <link rel="preconnect" href="https://www.reddit.com" />
        <link rel="dns-prefetch" href="https://hacker-news.firebaseio.com" />
        <link rel="dns-prefetch" href="https://dev.to" />
        <link rel="dns-prefetch" href="https://www.reddit.com" />
      </head>
      <body className="bg-surface antialiased font-sans">{children}</body>
    </html>
  );
}
