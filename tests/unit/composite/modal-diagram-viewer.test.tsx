import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModalDiagramViewer } from '../../../src/components/composite/ModalDiagramViewer';

describe('TU-COMPOSITE-11: Composite - ModalDiagramViewer Component', () => {
  const sampleSvg = '<svg id="test-mermaid-svg"><g class="node"><text>Microservices Layer</text></g></svg>';

  it('renders nothing when isOpen is false or svgContent is null', () => {
    const { container, rerender } = render(
      <ModalDiagramViewer isOpen={false} svgContent={sampleSvg} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();

    rerender(<ModalDiagramViewer isOpen={true} svgContent={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders fit view overlay with title, controls, close button, and svg content when open', () => {
    render(
      <ModalDiagramViewer
        isOpen={true}
        svgContent={sampleSvg}
        onClose={vi.fn()}
        title="3-Tier Architecture Flow"
        closeAriaLabel="Close diagram view"
      />
    );

    expect(screen.getByRole('dialog', { name: '3-Tier Architecture Flow' })).toBeInTheDocument();
    expect(screen.getByText('3-Tier Architecture Flow')).toBeInTheDocument();
    expect(screen.getByLabelText('Close diagram view')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset zoom and position')).toBeInTheDocument();
    expect(screen.getByText('Microservices Layer')).toBeInTheDocument();
  });

  it('handles zoom in, zoom out, and reset zoom actions', () => {
    render(
      <ModalDiagramViewer
        isOpen={true}
        svgContent={sampleSvg}
        onClose={vi.fn()}
        title="3-Tier Architecture Flow"
      />
    );

    const zoomInBtn = screen.getByLabelText('Zoom in');
    const zoomOutBtn = screen.getByLabelText('Zoom out');
    const resetBtn = screen.getByLabelText('Reset zoom and position');

    expect(screen.getByText('100%')).toBeInTheDocument();

    // Zoom in
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('125%')).toBeInTheDocument();

    fireEvent.click(zoomInBtn);
    expect(screen.getByText('150%')).toBeInTheDocument();

    // Zoom out
    fireEvent.click(zoomOutBtn);
    expect(screen.getByText('125%')).toBeInTheDocument();

    // Reset
    fireEvent.click(resetBtn);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked or Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <ModalDiagramViewer
        isOpen={true}
        svgContent={sampleSvg}
        onClose={handleClose}
        closeAriaLabel="Close diagram view"
      />
    );

    const closeBtn = screen.getByLabelText('Close diagram view');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('triggers onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <ModalDiagramViewer
        isOpen={true}
        svgContent={sampleSvg}
        onClose={handleClose}
      />
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
