import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '../../../src/components/common/Modal';

describe('TU-COMMON-05: Common - Modal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Modal Title">
        Modal Content
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('renders portal dialog into document.body and locks scroll when isOpen is true', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Dialog">
        <p>Dialog Body</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveClass('blog-modal-backdrop');
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Body')).toBeInTheDocument();
  });

  it('supports compound components Modal.Header, Modal.Body, and Modal.Footer', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <Modal.Header title="Compound Modal Title" subtitle="Subtitle Info" onClose={handleClose} />
        <Modal.Body>
          <p>Compound Modal Body</p>
        </Modal.Body>
        <Modal.Footer actions={<button type="button">Confirm</button>}>
          <span>Footer Notes</span>
        </Modal.Footer>
      </Modal>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Compound Modal Title' })).toBeInTheDocument();
    expect(screen.getByText('Subtitle Info')).toBeInTheDocument();
    expect(screen.getByText('Compound Modal Body')).toBeInTheDocument();
    expect(screen.getByText('Footer Notes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close modal' });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking backdrop and does not close when clicking modal content', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Dialog">
        <button type="button">Inside Button</button>
      </Modal>
    );

    const dialogBackdrop = screen.getByRole('dialog');
    const insideButton = screen.getByRole('button', { name: 'Inside Button' });

    fireEvent.click(insideButton);
    expect(handleClose).not.toHaveBeenCalled();

    fireEvent.click(dialogBackdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing Escape key', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Escape Test">
        <p>Press Escape</p>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders sticky header with close button', () => {
    const handleClose = vi.fn();
    render(
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Sticky Title"
        stickyHeader={true}
        isStickyTitleShown={true}
        closeAriaLabel="Close custom modal"
      >
        <p>Scrollable content</p>
      </Modal>
    );

    const closeBtn = screen.getByLabelText('Close custom modal');
    expect(closeBtn).toBeInTheDocument();
    expect(document.querySelector('.modal-sticky-header.has-title')).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
