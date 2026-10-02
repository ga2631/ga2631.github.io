'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default function AdminRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${defaultLocale}/admin`);
  }, [router]);

  return null;
}

