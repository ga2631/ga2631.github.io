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
        ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0'
        : 'bg-white/95 text-slate-700 border border-slate-200/90 shadow-slate-900/10 hover:bg-white hover:border-red-400 hover:text-red-600 hover:-translate-y-0.5 active:translate-y-0';

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

