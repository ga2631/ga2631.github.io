import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'glass' | 'plain' | 'interactive';
  hoverEffect?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      variant = 'glass',
      hoverEffect = true,
      as = 'div',
      header,
      footer,
      className = '',
      children,
      onClick,
      ...restProps
    },
    ref
  ) => {
    const Component = as;
    const classList: string[] = [];

    if (variant === 'glass') {
      classList.push('glass-panel');
    }
    if (onClick || variant === 'interactive') {
      classList.push('interactive-card');
    }
    if (className) {
      classList.push(className);
    }

    const combinedClassName = classList.join(' ');

    return (
      <Component
        ref={ref as any}
        className={combinedClassName}
        onClick={onClick}
        {...restProps}
      >
        {header && <div className="card-header">{header}</div>}
        {children}
        {footer && <div className="card-footer">{footer}</div>}
      </Component>
    );
  }
);

Card.displayName = 'Card';
