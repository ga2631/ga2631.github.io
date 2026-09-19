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

    // Build CSS classes
    const classList: string[] = [];

    if (variant === 'unstyled') {
      if (className) classList.push(className);
    } else if (variant === 'text-reset') {
      classList.push('btn-text-reset');
      if (className) classList.push(className);
    } else if (variant === 'tab') {
      classList.push('tab-btn');
      if (isActive) classList.push('active');
      if (className) classList.push(className);
    } else if (variant === 'icon') {
      classList.push('icon-btn');
      if (className) classList.push(className);
    } else if (variant === 'social-icon') {
      classList.push('social-icon-btn');
      if (className) classList.push(className);
    } else {
      classList.push('btn');
      if (variant === 'primary') classList.push('btn-primary');
      if (variant === 'secondary') classList.push('btn-secondary');
      if (variant === 'outline') classList.push('btn-outline');
      if (variant === 'ghost') classList.push('btn-ghost');
      if (size === 'sm') classList.push('btn-sm');
      if (size === 'lg') classList.push('btn-lg');
      if (isActive) classList.push('active');
      if (className) classList.push(className);
    }

    const combinedClassName = classList.join(' ');

    const spinnerNode = (
      <span
        className="spinner-sm"
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: size === 'sm' ? '12px' : '14px',
          height: size === 'sm' ? '12px' : '14px',
          border: '2px solid rgba(255,255,255,0.25)',
          borderTopColor: 'currentColor',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          flexShrink: 0,
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
