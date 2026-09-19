import React from 'react';
import { Badge } from '../common/Badge';

export interface SectionHeaderProps {
  badge?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  badgeWrapper?: React.ReactNode;
  extra?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
  badgeWrapper,
  extra,
}) => {
  return (
    <div
      className={`section-header ${className}`.trim()}
      style={align !== 'center' ? { textAlign: align } : undefined}
    >
      {badgeWrapper ? (
        badgeWrapper
      ) : badge ? (
        <Badge variant="section" icon={badgeIcon}>
          {badge}
        </Badge>
      ) : null}

      {typeof title === 'string' ? (
        <h2 className="section-title">{title}</h2>
      ) : (
        title
      )}

      {subtitle && (
        <p className="section-subtitle">
          {subtitle}
        </p>
      )}

      {extra && <div className="section-header-extra" style={{ marginTop: '20px' }}>{extra}</div>}
    </div>
  );
};
