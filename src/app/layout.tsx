import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { GA_MEASUREMENT_ID, GTM_ID } from '@/utils/analytics';

export const metadata: Metadata = {
  title: 'Huỳnh Nhật Tân | Software Architect & Lead Fullstack Engineer',
  description:
    'Executive Portfolio, ATS Curriculum Vitae & Architectural Tech Blog of Huynh Nhat Tan - Software Architect & Lead Engineer.',
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
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className="bg-gray-950 text-gray-100 antialiased selection:bg-red-500/30 selection:text-red-200">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>

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
