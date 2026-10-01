import React from 'react';
import { CloseIcon } from '../Icons';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  clearAriaLabel?: string;
  wrapperClassName?: string;
  onValueChange?: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      startAdornment,
      endAdornment,
      clearable = false,
      onClear,
      clearAriaLabel = 'Clear input',
      wrapperClassName = '',
      className = '',
      value,
      onChange,
      onValueChange,
      type = 'text',
      ...restProps
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== null && String(value).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onValueChange) onValueChange(e.target.value);
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
      if (onValueChange) {
        onValueChange('');
      }
    };

    const sizeClasses =
      size === 'sm'
        ? 'px-3 py-1.5 text-xs'
        : size === 'lg'
        ? 'px-5 py-3.5 text-base'
        : 'px-4 py-2.5 text-sm';

    const paddingWithAdornment = startAdornment ? 'pl-10' : '';
    const paddingWithClearable = clearable && hasValue ? 'pr-10' : '';

    const defaultInputClasses =
      `w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all outline-none ${sizeClasses} ${paddingWithAdornment} ${paddingWithClearable} ${className}`.trim();

    const inputNode = (
      <input
        ref={ref}
        type={type}
        className={defaultInputClasses}
        value={value}
        onChange={handleChange}
        {...restProps}
      />
    );

    // If adornments or clearable are needed, wrap in container
    if (startAdornment || endAdornment || clearable) {
      return (
        <div className={`relative flex items-center w-full ${wrapperClassName}`.trim()}>
          {startAdornment && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
              {startAdornment}
            </div>
          )}
          {inputNode}
          {clearable && hasValue && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              onClick={handleClear}
              aria-label={clearAriaLabel}
            >
              <CloseIcon size={12} />
            </button>
          )}
          {endAdornment && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center">
              {endAdornment}
            </div>
          )}
        </div>
      );
    }

    return inputNode;
  }
);

Input.displayName = 'Input';
