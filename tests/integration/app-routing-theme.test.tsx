import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../src/App';
import { uiTranslations } from '../../src/data/cvData';

describe('TS-01, TS-03, TS-04: App Routing, Theme & Localization Integration', () => {
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

  it('should toggle theme between dark and light, syncing data-theme attribute and localStorage', () => {
    render(<App />);

    const themeToggleButtons = screen.getAllByLabelText(/toggle theme/i);
    expect(themeToggleButtons.length).toBeGreaterThan(0);

    const initialTheme = document.documentElement.getAttribute('data-theme');

    // Click theme toggle
    fireEvent.click(themeToggleButtons[0]);

    const newTheme = document.documentElement.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
    expect(localStorage.getItem('app-theme')).toBe(newTheme);

    // Toggle back
    fireEvent.click(themeToggleButtons[0]);
    expect(document.documentElement.getAttribute('data-theme')).toBe(initialTheme);
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
