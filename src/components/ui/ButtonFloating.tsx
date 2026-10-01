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
    const displayText = label || children;
    const hasText = Boolean(displayText);

    const baseClasses = `h-11 rounded-full flex items-center justify-center gap-2 font-semibold text-sm shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden group ${
      hasText ? 'px-4' : 'w-11 px-0'
    }`;

    const variantClasses =
      floatingVariant === 'primary'
        ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg focus:ring-4 focus:ring-red-300'
        : 'bg-white text-gray-900 border border-gray-200 shadow-md hover:bg-gray-100 hover:text-red-600 hover:border-gray-300 focus:ring-4 focus:ring-gray-100';

    return (
      <Button
        ref={ref as any}
        variant="unstyled"
        className={`${baseClasses} ${variantClasses} ${className}`.trim()}
        {...restProps}
      >
        {glow && (
          <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}
        {icon}
        {displayText && <span className="text-sm font-semibold tracking-wide whitespace-nowrap">{displayText}</span>}
      </Button>
    );
  }
);

ButtonFloating.displayName = 'ButtonFloating';

