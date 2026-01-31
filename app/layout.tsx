import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'TagStock - AI-Powered Stock Photo Metadata Generator',
    template: '%s | TagStock',
  },
  description:
    'Automatically generate SEO-optimized keywords, titles, and descriptions for your stock photos using Google Gemini AI. Perfect for Adobe Stock and Shutterstock creators.',
  keywords: [
    'stock photo',
    'AI tagging',
    'metadata generator',
    'IPTC embedding',
    'stock photography tools',
    'Adobe Stock',
    'Shutterstock',
  ],
  authors: [{ name: 'TagStock Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tagstock',
    title: 'TagStock - AI-Powered Stock Photo Metadata Generator',
    description:
      'Save hours of manual tagging. Let AI generate perfect metadata for your stock photos.',
    siteName: 'TagStock',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TagStock - AI-Powered Stock Photo Metadata Generator',
    description: 'Automatically generate SEO-optimized keywords and meta for stock photos.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
