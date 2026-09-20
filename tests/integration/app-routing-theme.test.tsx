import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../src/App';
import { uiTranslations } from '../../src/data/cvData';

describe('TI-01: Integration - App Routing, Theme & Localization', () => {
  beforeEach(() => {
    window.location.hash = '';
    localStorage.clear();
  });

  it('should render home view components when hash is root or empty', () => {
    render(<App />);

    expect(screen.getAllByText(/TAN HUYNH/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('banner').length).toBeGreaterThan(0);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should switch to Blog Page view when hash is #/blog', async () => {
    window.location.hash = '#/blog';
    render(<App />);

    expect(screen.getByPlaceholderText(uiTranslations.en.blog.searchPlaceholder)).toBeInTheDocument();
    // Floating Save CV button should NOT be rendered on blog page
    expect(document.getElementById('floating-save-cv-btn')).not.toBeInTheDocument();
  });

  it('should dynamically switch route on window hashchange event', async () => {
    render(<App />);

    expect(screen.getAllByText(/TAN HUYNH/i).length).toBeGreaterThan(0);

    // Trigger hashchange to blog
    await act(async () => {
      window.location.hash = '#/blog';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(screen.getByPlaceholderText(uiTranslations.en.blog.searchPlaceholder)).toBeInTheDocument();

    // Trigger hashchange back to home
    await act(async () => {
      window.location.hash = '#/';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(screen.getAllByText(/TAN HUYNH/i).length).toBeGreaterThan(0);
  });


  it('should toggle language between EN and VI, updating document lang attribute and translated text', () => {
    render(<App />);

    // Initially EN
    expect(document.documentElement.getAttribute('lang')).toBe('en');

    // Find language switcher buttons in header
    const viButtons = screen.getAllByTitle(/tiếng việt/i);
    expect(viButtons.length).toBeGreaterThan(0);

    // Switch to Vietnamese
    fireEvent.click(viButtons[0]);

    expect(document.documentElement.getAttribute('lang')).toBe('vi');
    expect(localStorage.getItem('app-lang')).toBe('vi');

    // Switch back to English
    const enButtons = screen.getAllByTitle(/english/i);
    fireEvent.click(enButtons[0]);

    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(localStorage.getItem('app-lang')).toBe('en');
  });
});
