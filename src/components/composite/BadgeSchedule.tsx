import React from 'react';
import { Badge, BadgeProps } from '../common/Badge';

export interface BadgeScheduleProps extends Omit<BadgeProps, 'variant'> {
  dayCode?: string;
}

export const BadgeSchedule: React.FC<BadgeScheduleProps> = ({
  dayCode = 'all',
  className = '',
  children,
  icon,
  ...restProps
}) => {
  const getDayColorClasses = (code: string) => {
    const c = code.toLowerCase();
    if (c === 't2' || c === 'mon') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (c === 't3' || c === 'tue') return 'bg-purple-100 text-purple-800 border-purple-200';
    if (c === 't4' || c === 'wed') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (c === 't5' || c === 'thu') return 'bg-green-100 text-green-800 border-green-200';
    if (c === 't6' || c === 'fri') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const dayClass = `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDayColorClasses(dayCode)}`;
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

BadgeSchedule.displayName = 'BadgeSchedule';

