'use client';

import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

interface LoadingModalProps {
  /**
   * Title or status message to display. Defaults to localized Supabase query message.
   */
  message?: string;
  /**
   * Subtitle or details.
   */
  subtitle?: string;
  /**
   * Whether to render as a full page layout or a centered modal overlay.
   * Default is 'modal'.
   */
  variant?: 'modal' | 'fullscreen' | 'inline';
}

export function LoadingModal({
  message,
  subtitle,
  variant = 'modal',
}: LoadingModalProps) {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  const defaultTitle = isEn
    ? 'Querying data from Supabase...'
    : 'Đang truy vấn dữ liệu từ Supabase...';

  // Lock body scroll while modal/fullscreen loading is active
  React.useEffect(() => {
    if (variant === 'inline') return;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [variant]);

  const content = (
    <div className="relative bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl shadow-black/30 flex flex-col items-center text-center overflow-hidden z-10">
      {/* Decorative ambient top glow */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-b from-red-500/15 via-rose-500/10 to-transparent blur-2xl pointer-events-none" />

      {/* Animated Glowing Database / Supabase Icon */}
      <div className="relative mb-6">
        {/* Outer pulsating ring */}
        <div className="absolute -inset-3 bg-gradient-to-tr from-red-500/20 via-rose-500/30 to-amber-500/20 rounded-full blur-md animate-pulse" />
        
        {/* Orbiting particle ring */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-red-500/30 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
            {/* Database & Lightning SVG */}
            <svg
              className="w-8 h-8 text-red-600 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
            
            {/* Real-time sync spark badge */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight mb-2">
        {message || 'Loading'}
      </h3>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-6 font-normal leading-relaxed">
        {subtitle || 'Loading'}
      </p>

      {/* Modern Shimmer Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden relative">
        <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full animate-[progress_1.6s_ease-in-out_infinite]" />
      </div>
    </div>
  );

  if (variant === 'inline') {
    return (
      <div className="py-12 flex items-center justify-center p-4 w-full">
        {content}
      </div>
    );
  }

  // Fullscreen & Modal: Always full-screen fixed overlay covering 100% of viewport with dark backdrop
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in"
    >
      {content}
    </div>
  );
}
