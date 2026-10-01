import { supportedLocales } from '@/i18n/config';

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  return (
    <div data-locale={lang}>
      {children}
    </div>
  );
}
