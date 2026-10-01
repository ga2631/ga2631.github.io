import React from 'react';
import { Badge } from 'flowbite-react';
import { CloseIcon } from '../Icons.tsx';

export interface BadgeFilterChipProps {
  chipKey?: string;
  chipValue?: React.ReactNode;
  onRemove: () => void;
  removeAriaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export const BadgeFilterChip: React.FC<BadgeFilterChipProps> = ({
  chipKey,
  chipValue,
  onRemove,
  removeAriaLabel = 'Remove filter',
  className = '',
  children,
}) => {
  const displayValue = chipValue !== undefined ? chipValue : children;

  return (
    <Badge
      color="failure"
      size="xs"
      className={`inline-flex items-center gap-1 py-1 px-2.5 ${className}`.trim()}
    >
      {chipKey && <span className="font-semibold text-gray-500 mr-1">{chipKey}:</span>}
      <span className="font-bold">{displayValue}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={removeAriaLabel}
        className="ml-1 p-0.5 rounded-full hover:bg-red-200 text-red-700 cursor-pointer transition-colors"
      >
        <CloseIcon size={12} />
      </button>
    </Badge>
  );
};

BadgeFilterChip.displayName = 'BadgeFilterChip';
