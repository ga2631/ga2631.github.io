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
        ? 'p-2 text-xs'
        : size === 'lg'
        ? 'p-4 text-base'
        : 'p-2.5 text-sm';

    const paddingWithAdornment = startAdornment ? 'ps-10' : '';
    const paddingWithClearable = clearable && hasValue ? 'pe-10' : '';

    const defaultInputClasses =
      `block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-red-500 focus:border-red-500 transition-colors ${sizeClasses} ${paddingWithAdornment} ${paddingWithClearable} ${className}`.trim();

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
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-500">
              {startAdornment}
            </div>
          )}
          {inputNode}
          {clearable && hasValue && (
            <button
              type="button"
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-900 cursor-pointer"
              onClick={handleClear}
              aria-label={clearAriaLabel}
            >
              <CloseIcon size={14} />
            </button>
          )}
          {endAdornment && (
            <div className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-500">
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
