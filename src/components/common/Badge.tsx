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
      'inline-flex items-center gap-2 px-4 py-1.5 bg-red-50/80 border border-red-200/80 rounded-full text-xs font-semibold text-red-600 uppercase tracking-wider mb-4'
    );
    if (className) classList.push(className);
  } else if (variant === 'tag-pill') {
    classList.push(
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100/90 text-slate-700 border border-slate-200/80 hover:bg-white hover:border-red-300 hover:text-red-600 transition-all duration-150 cursor-pointer',
      isActive ? 'bg-red-50 text-red-600 border-red-300 font-semibold active' : ''
    );
    if (className) classList.push(className);
  } else if (variant === 'filter-chip') {
    classList.push(
      'inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs font-medium text-red-700 shadow-sm'
    );
    if (className) classList.push(className);
  } else {
    classList.push(
      'inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-150',
      size === 'sm' ? 'px-2.5 py-0.5 text-[0.75rem]' : 'px-3 py-1 text-xs'
    );

    if (variant === 'emerald') {
      classList.push('bg-emerald-50 text-emerald-700 border border-emerald-200/80');
    } else if (variant === 'purple') {
      classList.push('bg-purple-50 text-purple-700 border border-purple-200/80');
    } else if (variant === 'cyan') {
      classList.push('bg-sky-50 text-sky-700 border border-sky-200/80');
    } else if (variant === 'rose') {
      classList.push('bg-rose-50 text-rose-700 border border-rose-200/80');
    } else if (variant === 'amber') {
      classList.push('bg-amber-50 text-amber-700 border border-amber-200/80');
    } else {
      classList.push('bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300');
    }

    if (isActive) classList.push('ring-1 ring-red-500 font-semibold active');
    if (interactive || onClick) classList.push('cursor-pointer hover:shadow-sm');
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
        {chipKey && <span className="text-slate-500 font-normal">{chipKey}:</span>}
        <strong>{children}</strong>
        {(removable || onRemove) && (
          <button
            type="button"
            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-200/60 text-red-600 transition-colors"
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
        {count !== undefined && <span className="text-[0.75rem] font-bold text-slate-500">{count}</span>}
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
          className="ml-1 w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
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
