'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { ArrowUpIcon, DownloadIcon } from './Icons';
import { CVData } from '../types';
import { UITranslation } from '@/i18n';
import { PrintCV } from './PrintCV';
import { trackScrollToTop, trackPrintCV } from '../utils/analytics';

export interface FloatingActionsProps {
  data?: CVData;
  tPrintCv?: UITranslation['printCv'];
  saveCvLabel: string;
  tCommon: UITranslation['common'];
  threshold?: number;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  data,
  tPrintCv,
  saveCvLabel,
  tCommon,
  threshold = 320,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const handleScrollToTop = () => {
    trackScrollToTop();
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handlePrint = () => {
    trackPrintCV('trigger_print');
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto" role="region" aria-label="Floating quick actions">
        {showScrollTop && (
          <Button
            color="light"
            pill
            onClick={handleScrollToTop}
            title={tCommon.scrollToTop || 'Scroll to top'}
            aria-label={tCommon.scrollToTop || 'Scroll to top'}
            className="w-11 h-11 p-0 shadow-lg flex items-center justify-center border-gray-300 hover:bg-gray-100"
          >
            <ArrowUpIcon size={18} />
          </Button>
        )}

        <Button
          color="failure"
          pill
          onClick={handlePrint}
          title={saveCvLabel}
          aria-label={saveCvLabel}
          className="shadow-lg h-11"
        >
          <span className="flex items-center gap-2">
            <DownloadIcon size={18} />
            <span className="text-sm font-semibold">{saveCvLabel}</span>
          </span>
        </Button>
      </div>

      {data && tPrintCv && <PrintCV data={data} tPrintCv={tPrintCv} />}
    </>
  );
};

export default FloatingActions;
