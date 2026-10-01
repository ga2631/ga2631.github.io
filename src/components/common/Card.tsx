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
    <div className={`mb-4 ${className}`.trim()} {...restProps}>
      {children ? (
        children
      ) : (
        <>
          {(badge || icon || action) && (
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {icon}
                {badge}
              </div>
              {action && <div>{action}</div>}
            </div>
          )}
          {title && (
            typeof title === 'string' ? (
              <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">{title}</h5>
            ) : (
              title
            )
          )}
          {subtitle && (
            typeof subtitle === 'string' ? (
              <div className="text-sm font-normal text-gray-500">{subtitle}</div>
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
      className={`flex-1 text-gray-600 ${className}`.trim()}
      style={style}
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
      className={`mt-auto pt-4 border-t border-gray-100 ${className}`.trim()}
      style={style}
      {...restProps}
    >
      {tags}
      {children}
      {actions && <div className="mt-3 flex items-center justify-end gap-2">{actions}</div>}
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
    const classList: string[] = ['bg-white border border-gray-200 rounded-lg shadow-xs flex flex-col'];

    if (onClick || variant === 'interactive') {
      classList.push('cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200');
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
        style={style}
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

export default Card;
