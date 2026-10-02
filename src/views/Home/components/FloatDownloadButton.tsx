'use client';

import React from 'react';
import { trackPrintCV } from '@/utils/analytics';
import { useLanguage } from '@/i18n/LanguageContext';

export function FloatDownloadButton({ resumePdfUrl }: { resumePdfUrl?: string }) {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  const handleClick = (e: React.MouseEvent) => {
    trackPrintCV('trigger_print');
    if (!resumePdfUrl) {
      e.preventDefault();
      window.print();
    }
  };

  return (
    <a
      href={resumePdfUrl || '#'}
      onClick={handleClick}
      download={Boolean(resumePdfUrl)}
      title={isEn ? 'Save CV' : 'Tải xuống CV'}
      aria-label={isEn ? 'Save CV' : 'Tải xuống CV'}
      className="fixed bottom-8 right-8 z-50 text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full p-4 shadow-xl shadow-red-500/40 transition-transform hover:scale-110 flex items-center justify-center group"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    </a>
  );
}
