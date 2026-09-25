import type { Metadata, Viewport } from 'next';
import React from 'react';
import Script from 'next/script';
import { Inter, Outfit, Source_Code_Pro } from 'next/font/google';
import '@/styles/index.scss';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  preload: true,
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-mono',
  preload: true,
});

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';

export const viewport: Viewport = {
  themeColor: '#f8fafc',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ga2631.github.io'),
  title: {
    default: 'Tan Huynh Nhat | Software Engineer - Portfolio & CV',
    template: '%s | Tan Huynh Nhat',
  },
  description:
    'Professional portfolio and CV of Tan Huynh Nhat (ga2631) - Software Engineer specializing in scalable full-stack web applications, distributed systems, modern React, Next.js, TypeScript, Rust, and Cloud DevOps.',
  keywords: [
    'Tan Huynh Nhat',
    'ga2631',
    'Software Engineer',
    'Fullstack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Rust',
    'Docker',
    'Portfolio',
    'CV',
    'Web Developer',
    'ATS CV',
  ],
  authors: [{ name: 'Tan Huynh Nhat', url: 'https://ga2631.github.io' }],
  creator: 'Tan Huynh Nhat',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    url: 'https://ga2631.github.io/',
    title: 'Tan Huynh Nhat | Software Engineer - Portfolio & CV',
    description:
      'Explore the CV, technical projects, engineering case studies, and tech articles of Tan Huynh Nhat.',
    siteName: 'Tan Huynh Nhat Portfolio',
    images: [
      {
        url: 'https://ga2631.github.io/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tan Huynh Nhat Portfolio & CV',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tan Huynh Nhat | Software Engineer - Portfolio & CV',
    description:
      'Explore the CV, technical projects, engineering case studies, and tech articles of Tan Huynh Nhat.',
    images: ['https://ga2631.github.io/og-image.png'],
  },
  alternates: {
    canonical: 'https://ga2631.github.io/vi/',
    languages: {
      vi: 'https://ga2631.github.io/vi/',
      en: 'https://ga2631.github.io/en/',
      'x-default': 'https://ga2631.github.io/vi/',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tan Huynh Nhat',
    alternateName: 'ga2631',
    jobTitle: 'Software Engineer',
    url: 'https://ga2631.github.io/vi/',
    sameAs: [
      'https://github.com/ga2631',
      'https://linkedin.com/in/tanhn',
    ],
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Rust',
      'PostgreSQL',
      'Docker',
      'System Architecture',
    ],
  };

  const isGtmActive = GTM_ID && GTM_ID !== 'GTM-XXXXXXX' && GTM_ID !== 'GTM-DEV0000';
  const isGaActive =
    GA_MEASUREMENT_ID &&
    GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' &&
    GA_MEASUREMENT_ID !== 'G-DEV0000000';

  return (
    <html
      lang="vi"
      className={`${inter.variable} ${outfit.variable} ${sourceCodePro.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* GTM Noscript (fallback for non-JS environments) */}
        {isGtmActive && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {children}

        {/* Google Tag Manager (GTM) Container Script */}
        {isGtmActive && (
          <Script
            id="gtm-container-loader"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}

        {/* Google Analytics 4 (GA4) Direct gtag Script */}
        {isGaActive && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script
              id="ga4-direct-loader"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', {
  page_path: window.location.pathname,
  anonymize_ip: true
});
`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
