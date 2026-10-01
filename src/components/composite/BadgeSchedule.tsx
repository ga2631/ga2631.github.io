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
    if (c === 't2' || c === 'mon') return 'bg-amber-50 text-amber-700 border-amber-200/80';
    if (c === 't3' || c === 'tue') return 'bg-purple-50 text-purple-700 border-purple-200/80';
    if (c === 't4' || c === 'wed') return 'bg-sky-50 text-sky-700 border-sky-200/80';
    if (c === 't5' || c === 'thu') return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    if (c === 't6' || c === 'fri') return 'bg-rose-50 text-rose-700 border-rose-200/80';
    return 'bg-slate-100 text-slate-700 border-slate-200/80';
  };

  const dayClass = `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDayColorClasses(dayCode)}`;
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

