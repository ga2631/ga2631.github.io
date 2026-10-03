import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Roboto } from 'next/font/google';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { FlowbiteInit } from '@/components/common/FlowbiteInit';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { GA_MEASUREMENT_ID, GTM_ID } from '@/utils/analytics';

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Huỳnh Nhật Tân - Portfolio',
  description:
    'Huỳnh Nhật Tân - Executive Portfolio & ATS Curriculum Vitae. Building High-Performance Backend & Data Platforms.',
  metadataBase: new URL('https://ga2631.github.io'),
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`scroll-smooth ${roboto.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="bg-[#fafafa] min-h-screen text-gray-800 font-sans antialiased relative flex flex-col">
        <LanguageProvider>
          {children}
          <FlowbiteInit />
        </LanguageProvider>

        {/* Google Analytics 4 & GTM */}
        {GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && (
          <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        )}
        {GTM_ID && GTM_ID !== 'GTM-XXXXXXX' && (
          <GoogleTagManager gtmId={GTM_ID} />
        )}
      </body>
    </html>
  );
}
