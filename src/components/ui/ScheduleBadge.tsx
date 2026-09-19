import React from 'react';
import { Badge, BadgeProps } from '../common/Badge';

export interface ScheduleBadgeProps extends Omit<BadgeProps, 'variant'> {
  dayCode?: string;
}

export const ScheduleBadge: React.FC<ScheduleBadgeProps> = ({
  dayCode = 'all',
  className = '',
  children,
  icon,
  ...restProps
}) => {
  const dayClass = `schedule-day-badge badge-${dayCode.toLowerCase()}`;
  const combinedClass = `${dayClass} ${className}`.trim();

  return (
    <Badge
      variant="unstyled"
      className={combinedClass}
      icon={icon}
      {...restProps}
    >
      {children}
    </Badge>
  );
};
