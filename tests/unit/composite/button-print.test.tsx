import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ButtonPrint } from '../../../src/components/composite/ButtonPrint';

describe('TU-COMPOSITE-05: Composite - ButtonPrint Component', () => {
  const mockTCommon = {
    scrollToTop: 'Scroll to top',
    exportPdf: 'Export PDF',
  } as any;

  beforeEach(() => {
    window.print = vi.fn();
  });

  describe('Default variant (standard button for sidebar/drawer)', () => {
    it('renders as standard button with default label and primary variant', () => {
      render(
        <ButtonPrint
          tCommon={mockTCommon}
        />
      );

      const button = screen.getByRole('button', { name: /export pdf/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn-primary');
    });

    it('renders custom label and custom buttonVariant', () => {
      render(
        <ButtonPrint
          buttonVariant="secondary"
          label="Save Resume (PDF)"
        />
      );

      const button = screen.getByRole('button', { name: /save resume \(pdf\)/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn-secondary');
    });

    it('triggers onPrint handler when clicked', () => {
      const handlePrint = vi.fn();
      render(
        <ButtonPrint
          label="Save CV"
          onPrint={handlePrint}
        />
      );

      const button = screen.getByRole('button', { name: /save cv/i });
      fireEvent.click(button);
      expect(handlePrint).toHaveBeenCalledTimes(1);
    });

    it('falls back to window.print if onPrint is not provided', () => {
      render(
        <ButtonPrint
          label="Download"
        />
      );

      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);
      expect(window.print).toHaveBeenCalledTimes(1);
    });
  });

  describe('Floating variant (FAB for bottom-right quick actions)', () => {
    it('renders as ButtonFloating with floating styles and accessibility attributes', () => {
      render(
        <ButtonPrint
          variant="floating"
          label="Save CV"
          tCommon={mockTCommon}
        />
      );

      const fab = screen.getByRole('button', { name: /save cv/i });
      expect(fab).toBeInTheDocument();
      expect(fab).toHaveClass('floating-btn');
      expect(fab).toHaveClass('floating-btn-primary');
      expect(fab).toHaveAttribute('id', 'floating-save-cv-btn');
    });

    it('triggers onPrint callback on floating button click', () => {
      const handlePrint = vi.fn();
      render(
        <ButtonPrint
          variant="floating"
          label="Save CV"
          onPrint={handlePrint}
        />
      );

      const fab = screen.getByRole('button', { name: /save cv/i });
      fireEvent.click(fab);
      expect(handlePrint).toHaveBeenCalledTimes(1);
    });
  });
});
