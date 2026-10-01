import React from 'react';
import { CloseIcon } from '../Icons';

export type BadgeVariant =
  | 'default'
  | 'section'
  | 'emerald'
  | 'purple'
  | 'cyan'
  | 'rose'
  | 'amber'
  | 'tag-pill'
  | 'filter-chip'
  | 'unstyled';

export interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  count?: number | string;
  chipKey?: string;
  interactive?: boolean;
  isActive?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  removeAriaLabel?: string;
  as?: 'span' | 'button' | 'div';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  count,
  chipKey,
  interactive = false,
  isActive = false,
  removable = false,
  onRemove,
  removeAriaLabel = 'Remove',
  as = 'span',
  className = '',
  children,
  onClick,
  ...restProps
}) => {
  const classList: string[] = [];

  if (variant === 'unstyled') {
    if (className) classList.push(className);
  } else if (variant === 'section') {
    classList.push(
      'inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-100 text-red-800 border border-red-200 text-xs font-semibold rounded-full uppercase tracking-wider mb-4'
    );
    if (className) classList.push(className);
  } else if (variant === 'tag-pill') {
    classList.push(
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border',
      isActive
        ? 'bg-red-100 text-red-700 border-red-300 font-semibold'
        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:text-gray-900'
    );
    if (className) classList.push(className);
  } else if (variant === 'filter-chip') {
    classList.push(
      'inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 border border-red-200 rounded-full text-xs font-medium shadow-xs'
    );
    if (className) classList.push(className);
  } else {
    // Flowbite Standard Badge Styles
    classList.push(
      'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-150',
      size === 'sm' ? 'px-2.5 py-0.5 text-[0.75rem]' : 'px-3 py-1 text-xs'
    );

    if (variant === 'emerald') {
      classList.push('bg-green-100 text-green-800 border border-green-200');
    } else if (variant === 'purple') {
      classList.push('bg-purple-100 text-purple-800 border border-purple-200');
    } else if (variant === 'cyan') {
      classList.push('bg-cyan-100 text-cyan-800 border border-cyan-200');
    } else if (variant === 'rose') {
      classList.push('bg-red-100 text-red-800 border border-red-200');
    } else if (variant === 'amber') {
      classList.push('bg-yellow-100 text-yellow-800 border border-yellow-200');
    } else {
      classList.push('bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200');
    }

    if (isActive) classList.push('ring-2 ring-red-500 font-semibold');
    if (interactive || onClick) classList.push('cursor-pointer hover:opacity-90');
    if (className) classList.push(className);
  }

  const combinedClassName = classList.join(' ');
  const Component = as === 'button' || (onClick && as !== 'div' && variant === 'tag-pill') ? 'button' : as;

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  if (variant === 'filter-chip') {
    return (
      <span className={combinedClassName} {...restProps}>
        {chipKey && <span className="text-gray-500 font-normal">{chipKey}:</span>}
        <strong>{children}</strong>
        {(removable || onRemove) && (
          <button
            type="button"
            className="w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-red-200 text-red-700 transition-colors ml-1 cursor-pointer"
            onClick={handleRemove}
            aria-label={removeAriaLabel}
          >
            <CloseIcon size={12} />
          </button>
        )}
      </span>
    );
  }

  if (variant === 'tag-pill') {
    return (
      <Component
        type={Component === 'button' ? 'button' : undefined}
        className={combinedClassName}
        onClick={onClick}
        {...restProps}
      >
        <span>{children}</span>
        {count !== undefined && (
          <span className="text-[0.75rem] font-bold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700 ml-1">
            {count}
          </span>
        )}
      </Component>
    );
  }

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      className={combinedClassName}
      onClick={onClick}
      {...restProps}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span className="ml-1 text-[0.75rem] font-semibold opacity-80">
          {count}
        </span>
      )}
      {(removable || onRemove) && (
        <button
          type="button"
          className="ml-1 w-3.5 h-3.5 inline-flex items-center justify-center rounded-full hover:bg-black/10 transition-colors cursor-pointer"
          onClick={handleRemove}
          aria-label={removeAriaLabel}
        >
          <CloseIcon size={12} />
        </button>
      )}
    </Component>
  );
};

export default Badge;
