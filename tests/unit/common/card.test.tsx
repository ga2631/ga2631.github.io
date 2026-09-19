import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '../../../src/components/common/Card';

describe('Tier 1: Card Component', () => {
  it('renders default glass card as div with flex layout', () => {
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

  it('supports compound components Card.Header, Card.Body, and Card.Footer', () => {
    render(
      <Card>
        <Card.Header title="Compound Title" subtitle="Subtitle Text" />
        <Card.Body>
          <p>Compound Body Content</p>
        </Card.Body>
        <Card.Footer actions={<button type="button">Action Button</button>}>
          <span>Footer Content</span>
        </Card.Footer>
      </Card>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Compound Title' })).toBeInTheDocument();
    expect(screen.getByText('Subtitle Text')).toBeInTheDocument();
    expect(screen.getByText('Compound Body Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();

    const footer = screen.getByText('Footer Content').parentElement;
    expect(footer).toHaveClass('card-footer');
    expect(footer?.style.marginTop).toBe('auto');
  });

  it('supports backwards-compatible header and footer slot props', () => {
    render(
      <Card
        header={<h3>Slot Title</h3>}
        footer={<button type="button">Slot Footer</button>}
      >
        <p>Main Body</p>
      </Card>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Slot Title' })).toBeInTheDocument();
    expect(screen.getByText('Main Body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Slot Footer' })).toBeInTheDocument();
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
