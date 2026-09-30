import { getActiveLanguageCodes } from '@/services/languageService';

export async function generateStaticParams() {
  const langCodes = await getActiveLanguageCodes();
  return langCodes.map((lang) => ({ lang }));
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
