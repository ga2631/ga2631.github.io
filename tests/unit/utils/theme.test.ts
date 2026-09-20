import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTodayDateString,
  getTimeBasedDefaultTheme,
  getInitialTheme,
  THEME_STORAGE_KEY,
} from '../../../src/utils/theme';

describe('TU-UTILS-01: Utils - Theme Utility (Light Theme Only)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getTodayDateString', () => {
    it('should format date correctly as YYYY-MM-DD', () => {
      const date = new Date(2026, 8, 19, 10, 0, 0); // Sep 19, 2026
      expect(getTodayDateString(date)).toBe('2026-09-19');
    });

    it('should pad single-digit months and days with leading zero', () => {
      const date = new Date(2026, 0, 5, 14, 0, 0); // Jan 5, 2026
      expect(getTodayDateString(date)).toBe('2026-01-05');
    });
  });

  describe('getTimeBasedDefaultTheme & getInitialTheme', () => {
    it('should always return light theme', () => {
      expect(getTimeBasedDefaultTheme()).toBe('light');
      expect(getInitialTheme()).toBe('light');
    });

    it('should have THEME_STORAGE_KEY defined', () => {
      expect(THEME_STORAGE_KEY).toBe('app-theme');
    });
  });
});
