import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '../Icons.tsx';
import { UITranslation } from '../../data/cvData.ts';
import { ButtonFloating } from '../ui';

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
    <ButtonFloating
      floatingVariant="secondary"
      onClick={scrollToTop}
      title={displayTitle}
      aria-label={displayTitle}
      icon={<ArrowUpIcon size={18} />}
      className={className}
    />
  );
};

ButtonFloatingScrollTop.displayName = 'ButtonFloatingScrollTop';
