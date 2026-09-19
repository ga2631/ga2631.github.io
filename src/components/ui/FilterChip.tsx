import React from 'react';
import { Badge, BadgeProps } from '../common/Badge';

export interface FilterChipProps extends Omit<BadgeProps, 'variant'> {
  chipKey?: string;
  chipValue?: React.ReactNode;
  onRemove: () => void;
  removeAriaLabel?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
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
