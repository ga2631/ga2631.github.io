'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    let targetLocale = 'vi';
    try {
      const savedLang = localStorage.getItem('app-lang');
      if (savedLang === 'en' || savedLang === 'vi') {
        targetLocale = savedLang;
      }
    } catch {
      // ignore
    }
    router.replace(`/${targetLocale}/`);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700 gap-3">
      <div className="w-9 h-9 border-[3px] border-red-200 border-t-red-600 rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-500">Đang chuyển hướng / Redirecting...</p>
    </div>
  );
}
