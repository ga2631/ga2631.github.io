import React from 'react';
import { Input, InputProps } from '../common/Input';
import { SearchIcon } from '../Icons';

export interface SearchInputProps extends Omit<InputProps, 'startAdornment' | 'clearable'> {
  iconSize?: number;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
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

SearchInput.displayName = 'SearchInput';
