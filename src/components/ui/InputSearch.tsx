import React from 'react';
import { Input, InputProps } from '../common/Input';
import { SearchIcon } from '../Icons';

export interface InputSearchProps extends Omit<InputProps, 'startAdornment' | 'clearable'> {
  iconSize?: number;
}

export const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
  (
    {
      iconSize = 18,
      className = 'blog-search-input',
      wrapperClassName = 'blog-search-wrapper',
      clearAriaLabel = 'Clear search',
      placeholder = 'Search...',
      ...restProps
    },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        type="text"
        className={className}
        wrapperClassName={wrapperClassName}
        clearable={true}
        clearAriaLabel={clearAriaLabel}
        placeholder={placeholder}
        startAdornment={<SearchIcon size={iconSize} className="search-input-icon" />}
        {...restProps}
      />
    );
  }
);

InputSearch.displayName = 'InputSearch';
export { InputSearch as SearchInput, type InputSearchProps as SearchInputProps };
