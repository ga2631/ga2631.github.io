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
    classList.push('section-badge');
    if (className) classList.push(className);
  } else if (variant === 'tag-pill') {
    classList.push('sidebar-tag-pill');
    if (isActive) classList.push('active');
    if (className) classList.push(className);
  } else if (variant === 'filter-chip') {
    classList.push('filter-chip');
    if (className) classList.push(className);
  } else {
    classList.push('badge');
    if (variant === 'emerald') classList.push('badge-emerald');
    if (variant === 'purple') classList.push('badge-purple');
    if (variant === 'cyan') classList.push('badge-cyan');
    if (variant === 'rose') classList.push('badge-rose');
    if (variant === 'amber') classList.push('badge-amber');
    if (isActive) classList.push('active');
    if (interactive || onClick) classList.push('interactive');
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
        {chipKey && <span className="chip-key">{chipKey}:</span>}
        <strong>{children}</strong>
        {(removable || onRemove) && (
          <button
            type="button"
            className="chip-remove-btn"
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
        {count !== undefined && <span className="tag-count">{count}</span>}
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
        <span className="badge-count-pill" style={{ marginLeft: '4px', fontSize: '0.75rem' }}>
          {count}
        </span>
      )}
      {(removable || onRemove) && (
        <button
          type="button"
          className="chip-remove-btn"
          onClick={handleRemove}
          aria-label={removeAriaLabel}
          style={{ marginLeft: '4px' }}
        >
          <CloseIcon size={12} />
        </button>
      )}
    </Component>
  );
};
