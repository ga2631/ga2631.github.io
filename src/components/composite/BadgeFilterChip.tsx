import React from 'react';
import { Badge, BadgeProps } from '../common/Badge';

export interface BadgeFilterChipProps extends Omit<BadgeProps, 'variant'> {
  chipKey?: string;
  chipValue?: React.ReactNode;
  onRemove: () => void;
  removeAriaLabel?: string;
}

export const BadgeFilterChip: React.FC<BadgeFilterChipProps> = ({
  chipKey,
  chipValue,
  onRemove,
  removeAriaLabel = 'Remove filter',
  className = '',
  children,
  ...restProps
}) => {
  const displayValue = chipValue !== undefined ? chipValue : children;

  return (
    <Badge
      variant="filter-chip"
      chipKey={chipKey}
      removable={true}
      onRemove={onRemove}
      removeAriaLabel={removeAriaLabel}
      className={className}
      {...restProps}
    >
      {displayValue}
    </Badge>
  );
};

BadgeFilterChip.displayName = 'BadgeFilterChip';

