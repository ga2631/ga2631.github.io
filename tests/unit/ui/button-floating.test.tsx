import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ButtonFloating } from '../../../src/components/ui/ButtonFloating';

describe('TU-UI-03: UI - ButtonFloating Component', () => {
  it('renders primary floating button with glow element by default', () => {
    render(
      <ButtonFloating
        floatingVariant="primary"
        label="Download CV"
        icon={<span data-testid="fab-icon">📄</span>}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('floating-btn', 'floating-btn-primary');
    expect(screen.getByTestId('fab-icon')).toBeInTheDocument();
    expect(screen.getByText('Download CV')).toBeInTheDocument();
    expect(button.querySelector('.floating-btn-glow')).toBeInTheDocument();
  });

  it('renders secondary floating button without glow element', () => {
    render(
      <ButtonFloating
        floatingVariant="secondary"
        aria-label="Back to Top"
        icon={<span data-testid="arrow-icon">↑</span>}
      />
    );

    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toHaveClass('floating-btn', 'floating-btn-secondary');
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(button.querySelector('.floating-btn-glow')).toBeNull();
  });

  it('triggers click handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <ButtonFloating onClick={handleClick} label="Scroll Up" />
    );

    const button = screen.getByRole('button', { name: /scroll up/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
