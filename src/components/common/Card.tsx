import React from 'react';

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  action,
  className = '',
  children,
  ...restProps
}) => {
  return (
    <div className={`card-header ${className}`.trim()} {...restProps}>
      {children ? (
        children
      ) : (
        <>
          {(badge || icon || action) && (
            <div className="card-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon}
                {badge}
              </div>
              {action && <div>{action}</div>}
            </div>
          )}
          {title && (
            typeof title === 'string' ? (
              <h3 className="card-title" style={{ margin: '0 0 4px 0' }}>{title}</h3>
            ) : (
              title
            )
          )}
          {subtitle && (
            typeof subtitle === 'string' ? (
              <div className="card-subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{subtitle}</div>
            ) : (
              subtitle
            )
          )}
        </>
      )}
    </div>
  );
};
CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody: React.FC<CardBodyProps> = ({
  className = '',
  children,
  style,
  ...restProps
}) => {
  return (
    <div
      className={`card-body ${className}`.trim()}
      style={{ flex: 1, ...style }}
      {...restProps}
    >
      {children}
    </div>
  );
};
CardBody.displayName = 'CardBody';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode;
  tags?: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  actions,
  tags,
  className = '',
  children,
  style,
  ...restProps
}) => {
  return (
    <div
      className={`card-footer ${className}`.trim()}
      style={{ marginTop: 'auto', ...style }}
      {...restProps}
    >
      {tags}
      {children}
      {actions && <div className="card-footer-actions">{actions}</div>}
    </div>
  );
};
CardFooter.displayName = 'CardFooter';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'glass' | 'plain' | 'interactive';
  hoverEffect?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface CardComponent extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLElement>> {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
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
      style,
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
        style={{ display: 'flex', flexDirection: 'column', ...style }}
        {...restProps}
      >
        {header && (React.isValidElement(header) && (header.type === CardHeader || (header as any).type?.displayName === 'CardHeader') ? header : <CardHeader>{header}</CardHeader>)}
        {children}
        {footer && (React.isValidElement(footer) && (footer.type === CardFooter || (footer as any).type?.displayName === 'CardFooter') ? footer : <CardFooter>{footer}</CardFooter>)}
      </Component>
    );
  }
) as CardComponent;

Card.displayName = 'Card';
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
