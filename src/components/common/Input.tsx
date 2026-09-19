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

    const inputNode = (
      <input
        ref={ref}
        type={type}
        className={className}
        value={value}
        onChange={handleChange}
        {...restProps}
      />
    );

    // If adornments or clearable are needed, wrap in container
    if (startAdornment || endAdornment || clearable) {
      return (
        <div className={`input-wrapper ${wrapperClassName}`.trim()} style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          {startAdornment}
          {inputNode}
          {clearable && hasValue && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label={clearAriaLabel}
            >
              <CloseIcon size={14} />
            </button>
          )}
          {endAdornment}
        </div>
      );
    }

    return inputNode;
  }
);

Input.displayName = 'Input';
