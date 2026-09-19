import React from 'react';
import { Badge } from '../common/Badge';

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  badge?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  badgeWrapper?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  extra?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeIcon,
  badgeWrapper,
  title,
  subtitle,
  align = 'center',
  extra,
  className = '',
  children,
  ...restProps
}) => {
  return (
    <div
      className={`section-header ${className}`.trim()}
      style={align !== 'center' ? { textAlign: align } : undefined}
      {...restProps}
    >
      {children ? (
        children
      ) : (
        <>
          {badgeWrapper ? (
            badgeWrapper
          ) : badge ? (
            <Badge variant="section" icon={badgeIcon}>
              {badge}
            </Badge>
          ) : null}

          {title && (
            typeof title === 'string' ? (
              <h2 className="section-title">{title}</h2>
            ) : (
              title
            )
          )}

          {subtitle && (
            <p className="section-subtitle">
              {subtitle}
            </p>
          )}

          {extra && (
            <div className="section-header-extra" style={{ marginTop: '20px' }}>
              {extra}
            </div>
          )}
        </>
      )}
    </div>
  );
};
SectionHeader.displayName = 'SectionHeader';

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  id?: string;
  badge?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  badgeWrapper?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  extra?: React.ReactNode;
  headerClassName?: string;
  containerClassName?: string;
}

export interface SectionComponent extends React.FC<SectionProps> {
  Header: typeof SectionHeader;
}

export const Section: SectionComponent = ({
  id,
  badge,
  badgeIcon,
  badgeWrapper,
  title,
  subtitle,
  align = 'center',
  extra,
  headerClassName = '',
  containerClassName = 'container',
  className = 'section',
  children,
  ...restProps
}) => {
  const hasHeader = Boolean(title || badge || badgeWrapper || subtitle || extra);

  return (
    <section id={id} className={className} {...restProps}>
      <div className={containerClassName}>
        {hasHeader && (
          <SectionHeader
            badge={badge}
            badgeIcon={badgeIcon}
            badgeWrapper={badgeWrapper}
            title={title}
            subtitle={subtitle}
            align={align}
            extra={extra}
            className={headerClassName}
          />
        )}
        {children}
      </div>
    </section>
  );
};

Section.displayName = 'Section';
Section.Header = SectionHeader;
