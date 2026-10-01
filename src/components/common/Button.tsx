import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'icon'
  | 'social-icon'
  | 'text-reset'
  | 'tab'
  | 'unstyled';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingText?: string;
  isActive?: boolean;
  badge?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export type ButtonProps = BaseButtonProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button'; href?: never })
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { as?: 'a'; href: string })
  );

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      icon,
      iconPosition = 'left',
      isLoading = false,
      loadingText,
      isActive = false,
      badge,
      className = '',
      children,
      as,
      ...restProps
    },
    ref
  ) => {
    const isAnchor = as === 'a' || ('href' in restProps && typeof restProps.href === 'string');

    // Build Tailwind & utility CSS classes
    const classList: string[] = [];

    if (variant === 'unstyled') {
      if (className) classList.push(className);
    } else if (variant === 'text-reset') {
      classList.push('bg-transparent border-0 p-0 text-inherit cursor-pointer inline-flex items-center');
      if (className) classList.push(className);
    } else if (variant === 'tab') {
      classList.push(
        'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer inline-flex items-center gap-2',
        isActive
          ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm'
          : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
      );
      if (className) classList.push(className);
    } else if (variant === 'icon') {
      classList.push(
        'w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white hover:border-red-500/40 hover:text-red-600 hover:-translate-y-0.5 shadow-sm'
      );
      if (className) classList.push(className);
    } else if (variant === 'social-icon') {
      classList.push(
        'w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white hover:border-red-500/40 hover:text-red-600 hover:-translate-y-0.5 shadow-sm'
      );
      if (className) classList.push(className);
    } else {
      classList.push(
        'inline-flex items-center justify-center gap-2.5 font-semibold whitespace-nowrap cursor-pointer transition-all duration-200'
      );

      // Sizing
      if (size === 'sm') {
        classList.push('px-3.5 py-1.5 text-xs rounded-lg');
      } else if (size === 'lg') {
        classList.push('px-7 py-3.5 text-base rounded-xl');
      } else {
        classList.push('px-5 py-2.5 text-[0.95rem] rounded-xl');
      }

      // Variant Styles
      if (variant === 'primary') {
        classList.push(
          'bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 hover:-translate-y-0.5 active:translate-y-0'
        );
      } else if (variant === 'secondary') {
        classList.push(
          'bg-slate-100 text-slate-900 border border-slate-200/80 hover:bg-white hover:border-red-500/40 hover:-translate-y-0.5 shadow-sm'
        );
      } else if (variant === 'outline') {
        classList.push(
          'bg-transparent text-slate-800 border border-slate-200 hover:border-red-600 hover:text-red-600 hover:bg-red-50/60'
        );
      } else if (variant === 'ghost') {
        classList.push(
          'bg-transparent text-slate-600 hover:text-red-600 hover:bg-slate-100'
        );
      }

      if (isActive) classList.push('ring-2 ring-red-500/50');
      if (className) classList.push(className);
    }

    const combinedClassName = classList.join(' ');

    const spinnerNode = (
      <span
        className="inline-block border-2 border-white/25 border-t-current rounded-full animate-spin flex-shrink-0"
        aria-hidden="true"
        style={{
          width: size === 'sm' ? '12px' : '14px',
          height: size === 'sm' ? '12px' : '14px',
        }}
      />
    );

    const content = (
      <>
        {isLoading && spinnerNode}
        {!isLoading && icon && iconPosition === 'left' && icon}
        {isLoading && loadingText ? (
          <span>{loadingText}</span>
        ) : (
          children && (typeof children === 'string' ? <span>{children}</span> : children)
        )}
        {!isLoading && icon && iconPosition === 'right' && icon}
        {badge}
      </>
    );

    if (isAnchor) {
      const anchorProps = restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          className={combinedClassName}
          {...anchorProps}
        >
          {content}
        </a>
      );
    }

    const buttonProps = restProps as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type={buttonProps.type || 'button'}
        className={combinedClassName}
        disabled={isLoading || buttonProps.disabled}
        aria-busy={isLoading}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
