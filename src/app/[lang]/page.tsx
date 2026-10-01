import { Metadata } from 'next';
import { CvLayout } from '@/components/layouts/CvLayout';
import { HomeView } from '@/views/Home';
import { getCvData } from '@/services/cvService';
import { buildDynamicMetadata } from '@/utils/seo';
import { supportedLocales } from '@/i18n/config';

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const isEn = lang === 'en';

  return buildDynamicMetadata({
    locale: lang,
    path: '',
    title: isEn
      ? 'Huynh Nhat Tan | Software Architect & Lead Fullstack Engineer'
      : 'Huỳnh Nhật Tân | Software Architect & Lead Fullstack Engineer',
    description: isEn
      ? 'Executive Portfolio, ATS CV & Architectural Case Studies of Huynh Nhat Tan - Software Architect with 7+ years of experience.'
      : 'Hồ sơ năng lực ATS CV, kinh nghiệm kiến trúc hệ thống phân tán & giải pháp chịu tải cao của Huỳnh Nhật Tân.',
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  let initialCvData = null;
  try {
    initialCvData = await getCvData(lang);
  } catch {
    // Graceful fallback on build
  }

  return (
    <CvLayout>
      <HomeView initialCvData={initialCvData} />
    </CvLayout>
  );
}
