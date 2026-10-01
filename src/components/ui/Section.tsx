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
  const alignmentClass =
    align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <div
      className={`mb-14 ${alignmentClass} ${className}`.trim()}
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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 font-heading">
                {title}
              </h2>
            ) : (
              title
            )
          )}

          {subtitle && (
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {extra && (
            <div className="mt-5">
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
  containerClassName = 'container mx-auto max-w-[1200px] px-6',
  className = 'py-20 md:py-24',
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

export default Section;
