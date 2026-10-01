import { CvLayout } from '@/components/layouts/CvLayout';
import { HomeView } from '@/views/Home';
import { getCvData } from '@/services/cvService';
import { defaultLocale } from '@/i18n/config';

export default async function RootPage() {
  let initialCvData = null;
  try {
    initialCvData = await getCvData(defaultLocale);
  } catch {
    // Graceful fallback for SSR/export
  }

  return (
    <CvLayout>
      <HomeView initialCvData={initialCvData} />
    </CvLayout>
  );
}
