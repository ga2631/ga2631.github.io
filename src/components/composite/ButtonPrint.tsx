import React from 'react';
import { Button, ButtonVariant, ButtonSize } from '../common/Button';
import { ButtonFloating } from '../ui/ButtonFloating';
import { DownloadIcon } from '../Icons.tsx';
import { UITranslation } from '../../data/cvData.ts';

export interface ButtonPrintProps {
  onPrint?: () => void;
  variant?: 'floating' | 'default';
  buttonVariant?: ButtonVariant;
  size?: ButtonSize;
  label?: React.ReactNode;
  title?: string;
  className?: string;
  id?: string;
  iconSize?: number;
  tCommon?: UITranslation['common'];
  children?: React.ReactNode;
}

export const ButtonPrint: React.FC<ButtonPrintProps> = ({
  onPrint,
  variant = 'default',
  buttonVariant = 'primary',
  size = 'md',
  label,
  title,
  className = '',
  id,
  iconSize,
  tCommon,
  children,
  ...restProps
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const displayLabel = label || children || tCommon?.exportPdf || 'Download CV';
  const displayTitle = title || tCommon?.exportPdf || 'Export PDF';

  if (variant === 'floating') {
    return (
      <ButtonFloating
        id={id || 'floating-save-cv-btn'}
        floatingVariant="primary"
        onClick={handlePrint}
        title={displayTitle}
        aria-label={typeof displayLabel === 'string' ? displayLabel : displayTitle}
        icon={<DownloadIcon size={iconSize || 18} />}
        label={displayLabel}
        className={className}
        {...restProps}
      />
    );
  }

  return (
    <Button
      id={id}
      variant={buttonVariant}
      size={size}
      onClick={handlePrint}
      title={displayTitle}
      aria-label={typeof displayLabel === 'string' ? displayLabel : displayTitle}
      icon={<DownloadIcon size={iconSize || 16} />}
      className={className}
      {...restProps}
    >
      <span>{displayLabel}</span>
    </Button>
  );
};

ButtonPrint.displayName = 'ButtonPrint';
