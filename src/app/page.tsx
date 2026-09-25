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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0d14',
        color: '#94a3b8',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(14, 165, 233, 0.2)',
          borderTopColor: '#0ea5e9',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ fontSize: '0.9rem' }}>Đang chuyển hướng / Redirecting...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
