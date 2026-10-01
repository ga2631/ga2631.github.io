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
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-2',
        isActive
          ? 'bg-red-100 text-red-700 font-semibold'
          : 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'
      );
      if (className) classList.push(className);
    } else if (variant === 'icon' || variant === 'social-icon') {
      classList.push(
        'p-2.5 rounded-lg text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 hover:text-red-600 focus:ring-4 focus:ring-gray-100 flex items-center justify-center cursor-pointer transition-all shadow-xs'
      );
      if (className) classList.push(className);
    } else {
      // Flowbite Base Button
      classList.push(
        'inline-flex items-center justify-center gap-2 font-medium cursor-pointer transition-all focus:outline-none focus:ring-4 text-center'
      );

      // Flowbite Sizing
      if (size === 'sm') {
        classList.push('px-3 py-2 text-xs rounded-lg');
      } else if (size === 'lg') {
        classList.push('px-6 py-3.5 text-base rounded-lg');
      } else {
        classList.push('px-5 py-2.5 text-sm rounded-lg');
      }

      // Flowbite Color Variants
      if (variant === 'primary') {
        classList.push(
          'text-white bg-red-600 hover:bg-red-700 focus:ring-red-300 shadow-xs'
        );
      } else if (variant === 'secondary') {
        classList.push(
          'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-red-600 focus:ring-gray-100 shadow-xs'
        );
      } else if (variant === 'outline') {
        classList.push(
          'text-red-700 hover:text-white border border-red-700 hover:bg-red-700 focus:ring-red-300'
        );
      } else if (variant === 'ghost') {
        classList.push(
          'text-gray-600 hover:text-red-600 hover:bg-gray-100 focus:ring-gray-100'
        );
      }

      if (isActive) classList.push('ring-4 ring-red-300');
      if (className) classList.push(className);
    }

    const combinedClassName = classList.join(' ');

    const spinnerNode = (
      <svg
        className="animate-spin -ml-1 mr-2 w-4 h-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
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
