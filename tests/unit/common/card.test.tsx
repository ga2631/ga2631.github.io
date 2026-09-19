import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '../../../src/components/common/Card';

describe('Tier 1: Card Component', () => {
  it('renders default glass card as div', () => {
    const { container } = render(<Card>Card Body Content</Card>);
    const cardEl = container.firstChild as HTMLElement;

    expect(cardEl).toBeInTheDocument();
    expect(cardEl).toHaveClass('glass-panel');
    expect(cardEl.tagName.toLowerCase()).toBe('div');
    expect(screen.getByText('Card Body Content')).toBeInTheDocument();
  });

  it('renders semantic elements (article, section, li)', () => {
    const { rerender, container } = render(<Card as="article">Article Card</Card>);
    expect((container.firstChild as HTMLElement).tagName.toLowerCase()).toBe('article');

    rerender(<Card as="section">Section Card</Card>);
    expect((container.firstChild as HTMLElement).tagName.toLowerCase()).toBe('section');

    rerender(<Card as="li">List Item Card</Card>);
    expect((container.firstChild as HTMLElement).tagName.toLowerCase()).toBe('li');
  });

  it('renders header and footer slots when provided', () => {
    render(
      <Card
        header={<h3>Card Title</h3>}
        footer={<button type="button">Action</button>}
      >
        <p>Main Body</p>
      </Card>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Card Title' })).toBeInTheDocument();
    expect(screen.getByText('Main Body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('handles click events and adds interactive-card class when interactive or onClick provided', () => {
    const handleClick = vi.fn();
    render(
      <Card onClick={handleClick} className="test-card">
        Clickable Card
      </Card>
    );

    const card = screen.getByText('Clickable Card');
    expect(card).toHaveClass('interactive-card', 'glass-panel', 'test-card');

    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
