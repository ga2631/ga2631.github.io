import React from 'react';
import { Button, BaseButtonProps } from '../common/Button';

export interface ButtonFloatingProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    BaseButtonProps {
  floatingVariant?: 'primary' | 'secondary';
  glow?: boolean;
  label?: React.ReactNode;
}

export const ButtonFloating = React.forwardRef<HTMLButtonElement, ButtonFloatingProps>(
  (
    {
      floatingVariant = 'primary',
      glow = floatingVariant === 'primary',
      label,
      icon,
      className = '',
      children,
      ...restProps
    },
    ref
  ) => {
    const classList = ['floating-btn'];
    if (floatingVariant === 'primary') {
      classList.push('floating-btn-primary');
    } else {
      classList.push('floating-btn-secondary');
    }
    if (className) {
      classList.push(className);
    }

    const displayText = label || children;

    return (
      <Button
        ref={ref as any}
        variant="unstyled"
        className={classList.join(' ')}
        {...restProps}
      >
        {glow && <div className="floating-btn-glow" />}
        {icon}
        {displayText && <span className="floating-btn-text">{displayText}</span>}
      </Button>
    );
  }
);

ButtonFloating.displayName = 'ButtonFloating';
export { ButtonFloating as FloatingButton, type ButtonFloatingProps as FloatingButtonProps };
