import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchInput } from '../../../src/components/ui/SearchInput';

describe('Tier 2: SearchInput Component', () => {
  it('renders search input with default placeholder and search icon', () => {
    render(<SearchInput placeholder="Search articles..." value="" onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText('Search articles...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('blog-search-input');
    expect(input.parentElement).toHaveClass('blog-search-wrapper');
  });

  it('renders clear button when value is provided and clears value on click', () => {
    const handleClear = vi.fn();
    const handleValueChange = vi.fn();

    render(
      <SearchInput
        value="Microservices"
        onClear={handleClear}
        onValueChange={handleValueChange}
        clearAriaLabel="Clear search input"
      />
    );

    const clearButton = screen.getByLabelText('Clear search input');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith('');
  });

  it('supports onChange user typing interactions', () => {
    const handleChange = vi.fn();
    render(<SearchInput value="" onChange={handleChange} placeholder="Search" />);

    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'Rust' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
