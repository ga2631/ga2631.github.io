import React, { useState, useEffect } from 'react';
import { DownloadIcon, ArrowUpIcon } from './Icons.tsx';

interface FloatingActionsProps {
  onPrint: () => void;
  saveCvLabel: string;
  lang: 'vi' | 'en';
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onPrint,
  saveCvLabel,
  lang,
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
        <button
          className="floating-btn floating-btn-secondary"
          onClick={scrollToTop}
          title={lang === 'vi' ? 'Cuộn lên đầu trang' : 'Scroll to top'}
          aria-label={lang === 'vi' ? 'Cuộn lên đầu trang' : 'Scroll to top'}
        >
          <ArrowUpIcon size={18} />
        </button>
      )}

      {/* Floating Save CV Button */}
      <button
        className="floating-btn floating-btn-primary"
        onClick={onPrint}
        title={lang === 'vi' ? 'Tải / Xuất CV dạng PDF' : 'Save / Export CV as PDF'}
        aria-label={saveCvLabel}
        id="floating-save-cv-btn"
      >
        <div className="floating-btn-glow" />
        <DownloadIcon size={18} />
        <span className="floating-btn-text">{saveCvLabel}</span>
      </button>
    </div>
  );
};
