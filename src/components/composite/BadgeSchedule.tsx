import React from 'react';
import { Badge } from 'flowbite-react';

export interface BadgeScheduleProps {
  dayCode?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const BadgeSchedule: React.FC<BadgeScheduleProps> = ({
  dayCode = 'all',
  className = '',
  children,
  icon,
}) => {
  const getDayColor = (code: string): 'warning' | 'purple' | 'info' | 'success' | 'failure' | 'gray' => {
    const c = code.toLowerCase();
    if (c === 't2' || c === 'mon') return 'warning';
    if (c === 't3' || c === 'tue') return 'purple';
    if (c === 't4' || c === 'wed') return 'info';
    if (c === 't5' || c === 'thu') return 'success';
    if (c === 't6' || c === 'fri') return 'failure';
    return 'gray';
  };

  const color = getDayColor(dayCode);

  return (
    <Badge
      color={color}
      size="xs"
      className={className}
      icon={icon ? () => <>{icon}</> : undefined}
    >
      {children}
    </Badge>
  );
};

BadgeSchedule.displayName = 'BadgeSchedule';
