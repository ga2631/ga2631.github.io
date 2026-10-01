'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { ArrowUpIcon } from '../Icons.tsx';
import { UITranslation } from '@/i18n';
import { trackScrollToTop } from '../../utils/analytics';

export interface ButtonFloatingScrollTopProps {
  threshold?: number;
  tCommon?: UITranslation['common'];
  title?: string;
  className?: string;
  onClick?: () => void;
}

export const ButtonFloatingScrollTop: React.FC<ButtonFloatingScrollTopProps> = ({
  threshold = 320,
  tCommon,
  title,
  className = '',
  onClick,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    trackScrollToTop();
    if (onClick) {
      onClick();
    } else if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  if (!showScrollTop) return null;

  const displayTitle = title || tCommon?.scrollToTop || 'Scroll to top';

  return (
    <Button
      color="light"
      pill
      onClick={scrollToTop}
      title={displayTitle}
      aria-label={displayTitle}
      className={`w-11 h-11 p-0 shadow-lg flex items-center justify-center ${className}`.trim()}
    >
      <ArrowUpIcon size={18} />
    </Button>
  );
};

ButtonFloatingScrollTop.displayName = 'ButtonFloatingScrollTop';
