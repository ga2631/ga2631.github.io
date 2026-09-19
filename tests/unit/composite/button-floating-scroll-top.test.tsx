import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ButtonFloatingScrollTop } from '../../../src/components/composite/ButtonFloatingScrollTop';

describe('TU-COMPOSITE-04: Composite - ButtonFloatingScrollTop Component', () => {
  const mockTCommon = {
    scrollToTop: 'Scroll to top',
    exportPdf: 'Export PDF',
  } as any;

  beforeEach(() => {
    window.scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('does not render when window.scrollY is below the threshold', () => {
    render(
      <ButtonFloatingScrollTop
        tCommon={mockTCommon}
        threshold={300}
      />
    );

    expect(screen.queryByRole('button', { name: /scroll to top/i })).not.toBeInTheDocument();
  });

  it('renders and scrolls window to top on click when window.scrollY exceeds threshold', () => {
    render(
      <ButtonFloatingScrollTop
        tCommon={mockTCommon}
        threshold={300}
      />
    );

    // Initially not visible
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();

    // Trigger scroll event with scrollY > threshold
    window.scrollY = 400;
    fireEvent.scroll(window);

    const scrollTopButton = screen.getByLabelText('Scroll to top');
    expect(scrollTopButton).toBeInTheDocument();

    fireEvent.click(scrollTopButton);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('calls custom onClick handler if provided', () => {
    const customClick = vi.fn();
    render(
      <ButtonFloatingScrollTop
        tCommon={mockTCommon}
        threshold={200}
        onClick={customClick}
      />
    );

    window.scrollY = 250;
    fireEvent.scroll(window);

    const scrollTopButton = screen.getByLabelText('Scroll to top');
    fireEvent.click(scrollTopButton);
    expect(customClick).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
