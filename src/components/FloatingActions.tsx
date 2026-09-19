import React, { useState, useEffect } from 'react';
import { DownloadIcon, ArrowUpIcon } from './Icons.tsx';
import { UITranslation } from '../data/cvData.ts';
import { FloatingButton } from './ui';

interface FloatingActionsProps {
  onPrint: () => void;
  saveCvLabel: string;
  tCommon: UITranslation['common'];
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onPrint,
  saveCvLabel,
  tCommon,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="floating-actions-container" role="region" aria-label="Floating quick actions">
      {/* Scroll to top button */}
      {showScrollTop && (
        <FloatingButton
          floatingVariant="secondary"
          onClick={scrollToTop}
          title={tCommon.scrollToTop}
          aria-label={tCommon.scrollToTop}
          icon={<ArrowUpIcon size={18} />}
        />
      )}

      {/* Floating Save CV Button */}
      <FloatingButton
        floatingVariant="primary"
        onClick={onPrint}
        title={tCommon.exportPdf}
        aria-label={saveCvLabel}
        id="floating-save-cv-btn"
        icon={<DownloadIcon size={18} />}
        label={saveCvLabel}
      />
    </div>
  );
};


