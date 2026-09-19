import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../../../src/components/common/Input';

describe('Tier 1: Input Component', () => {
  it('renders standard input element without wrapper when no adornments or clearable', () => {
    render(<Input placeholder="Enter username" />);
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeInTheDocument();
    expect(input.parentElement?.classList.contains('input-wrapper')).toBe(false);
  });

  it('handles value changes via onChange and onValueChange', () => {
    const handleChange = vi.fn();
    const handleValueChange = vi.fn();

    render(
      <Input
        placeholder="Type here"
        onChange={handleChange}
        onValueChange={handleValueChange}
      />
    );

    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith('hello');
  });

  it('renders startAdornment and endAdornment wrapped in input-wrapper', () => {
    render(
      <Input
        placeholder="Search"
        startAdornment={<span data-testid="start-icon">🔍</span>}
        endAdornment={<span data-testid="end-icon">✓</span>}
        wrapperClassName="custom-wrapper"
      />
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();

    const wrapper = screen.getByPlaceholderText('Search').parentElement;
    expect(wrapper).toHaveClass('input-wrapper', 'custom-wrapper');
  });

  it('renders clear button when clearable is true and value is present', () => {
    const handleClear = vi.fn();
    const handleValueChange = vi.fn();

    const { rerender } = render(
      <Input
        clearable
        value=""
        placeholder="Search"
        onClear={handleClear}
        onValueChange={handleValueChange}
        clearAriaLabel="Clear input"
      />
    );

    // When empty, clear button shouldn't show
    expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();

    // When has value, clear button should show
    rerender(
      <Input
        clearable
        value="Searching for React"
        placeholder="Search"
        onClear={handleClear}
        onValueChange={handleValueChange}
        clearAriaLabel="Clear input"
      />
    );

    const clearBtn = screen.getByLabelText('Clear input');
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith('');
  });
});
