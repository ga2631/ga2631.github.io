import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../../src/components/common/Button';

describe('Tier 1: Button Component', () => {
  it('renders standard button with default secondary variant and md size', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-secondary');
  });

  it('renders primary, outline, ghost, and size classes correctly', () => {
    const { rerender } = render(
      <Button variant="primary" size="lg">
        Primary Large
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-primary', 'btn-lg');

    rerender(
      <Button variant="outline" size="sm">
        Outline Small
      </Button>
    );
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-outline', 'btn-sm');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-ghost');
  });

  it('renders specialized variants: tab, icon, social-icon, text-reset, and unstyled', () => {
    const { rerender } = render(<Button variant="tab" isActive>Tab Active</Button>);
    expect(screen.getByRole('button')).toHaveClass('tab-btn', 'active');

    rerender(<Button variant="icon" aria-label="Icon Btn">+</Button>);
    expect(screen.getByRole('button', { name: /icon btn/i })).toHaveClass('icon-btn');

    rerender(<Button variant="social-icon" aria-label="Social">S</Button>);
    expect(screen.getByRole('button', { name: /social/i })).toHaveClass('social-icon-btn');

    rerender(<Button variant="text-reset">Reset</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-text-reset');

    rerender(<Button variant="unstyled" className="custom-test-cls">Unstyled</Button>);
    const unstyled = screen.getByRole('button');
    expect(unstyled).toHaveClass('custom-test-cls');
    expect(unstyled).not.toHaveClass('btn');
  });

  it('renders polymorphic anchor tag when href or as="a" is supplied', () => {
    render(
      <Button as="a" href="https://example.com" target="_blank" rel="noreferrer">
        Link Button
      </Button>
    );
    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('btn', 'btn-secondary');
  });

  it('handles loading state with spinner and disabled behavior', () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading loadingText="Saving..." onClick={handleClick}>
        Save
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('supports icons on left or right and badges', () => {
    const IconLeft = <span data-testid="icon-left">👈</span>;
    const IconRight = <span data-testid="icon-right">👉</span>;
    const BadgeNode = <span data-testid="badge-node">3</span>;

    const { rerender } = render(
      <Button icon={IconLeft} iconPosition="left" badge={BadgeNode}>
        With Icon
      </Button>
    );
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
    expect(screen.getByTestId('badge-node')).toBeInTheDocument();

    rerender(
      <Button icon={IconRight} iconPosition="right">
        Right Icon
      </Button>
    );
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });

  it('fires onClick when clicked in normal state', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Action</Button>);
    fireEvent.click(screen.getByRole('button', { name: /action/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
