'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default function BlogRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${defaultLocale}/blog`);
  }, [router]);

  return null;
}

