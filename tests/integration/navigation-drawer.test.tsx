import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../../src/components/Header';
import { uiTranslations, cvDataEn } from '../../src/data/cvData';

describe('TS-01, TS-02: Header & Mobile Drawer Navigation Integration', () => {
  const defaultProps = {
    theme: 'dark' as const,
    toggleTheme: vi.fn(),
    lang: 'en' as const,
    setLang: vi.fn(),
    t: uiTranslations.en,
    personalInfo: cvDataEn.personalInfo,
    currentRoute: 'home' as const,
  };

  it('should render desktop navigation links and actions', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getAllByText(cvDataEn.personalInfo.fullName)[0]).toBeInTheDocument();
    expect(screen.getAllByText(uiTranslations.en.nav.about).length).toBeGreaterThan(0);
    expect(screen.getAllByText(uiTranslations.en.nav.experience).length).toBeGreaterThan(0);
    expect(screen.getAllByText(uiTranslations.en.nav.projects).length).toBeGreaterThan(0);
    expect(screen.getAllByText(uiTranslations.en.nav.skills).length).toBeGreaterThan(0);
    expect(screen.getAllByText(uiTranslations.en.nav.education).length).toBeGreaterThan(0);
    expect(screen.getAllByText(uiTranslations.en.nav.contact).length).toBeGreaterThan(0);
  });

  it('should open mobile drawer menu on hamburger button click and lock body scroll', () => {
    render(<Header {...defaultProps} />);

    const hamburgerBtn = screen.getByLabelText(/open navigation drawer menu/i);
    fireEvent.click(hamburgerBtn);

    // Drawer should be open
    expect(document.body.style.overflow).toBe('hidden');
    const drawerWrapper = document.querySelector('.drawer-wrapper');
    expect(drawerWrapper).toHaveClass('open');
  });

  it('should close drawer on backdrop click and restore body scroll', () => {
    render(<Header {...defaultProps} />);

    const hamburgerBtn = screen.getByLabelText(/open navigation drawer menu/i);
    fireEvent.click(hamburgerBtn);

    const backdrop = document.querySelector('.drawer-backdrop');
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop!);

    expect(document.body.style.overflow).toBe('');
  });

  it('should close drawer when Escape key is pressed', () => {
    render(<Header {...defaultProps} />);

    const hamburgerBtn = screen.getByLabelText(/open navigation drawer menu/i);
    fireEvent.click(hamburgerBtn);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(document.body.style.overflow).toBe('');
  });

  it('should trigger print dialog on Save CV button click inside drawer', () => {
    vi.useFakeTimers();
    render(<Header {...defaultProps} />);

    const hamburgerBtn = screen.getByLabelText(/open navigation drawer menu/i);
    fireEvent.click(hamburgerBtn);

    const saveCvButton = screen.getByRole('button', { name: new RegExp(uiTranslations.en.nav.saveCv, 'i') });
    fireEvent.click(saveCvButton);

    vi.advanceTimersByTime(350);

    expect(window.print).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
