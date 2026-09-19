import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTodayDateString,
  getTimeBasedDefaultTheme,
  getInitialTheme,
  saveManualThemeOverride,
  THEME_STORAGE_KEY,
  THEME_OVERRIDE_DATE_KEY,
} from '../../../src/utils/theme';

describe('TU-UTILS-01: Utils - Real-time Day/Night Theme & Daily Override Utility', () => {
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

  describe('getTimeBasedDefaultTheme', () => {
    it('should return light theme during daytime (06:00 to 17:59)', () => {
      // 06:00
      const d6 = new Date(2026, 8, 19, 6, 0, 0);
      expect(getTimeBasedDefaultTheme(d6)).toBe('light');

      // 10:30
      const d10 = new Date(2026, 8, 19, 10, 30, 0);
      expect(getTimeBasedDefaultTheme(d10)).toBe('light');

      // 12:00
      const d12 = new Date(2026, 8, 19, 12, 0, 0);
      expect(getTimeBasedDefaultTheme(d12)).toBe('light');

      // 17:59
      const d17 = new Date(2026, 8, 19, 17, 59, 59);
      expect(getTimeBasedDefaultTheme(d17)).toBe('light');
    });

    it('should return dark theme during nighttime (18:00 to 05:59)', () => {
      // 18:00
      const d18 = new Date(2026, 8, 19, 18, 0, 0);
      expect(getTimeBasedDefaultTheme(d18)).toBe('dark');

      // 21:00
      const d21 = new Date(2026, 8, 19, 21, 0, 0);
      expect(getTimeBasedDefaultTheme(d21)).toBe('dark');

      // 00:00 midnight
      const d0 = new Date(2026, 8, 19, 0, 0, 0);
      expect(getTimeBasedDefaultTheme(d0)).toBe('dark');

      // 05:59
      const d5 = new Date(2026, 8, 19, 5, 59, 59);
      expect(getTimeBasedDefaultTheme(d5)).toBe('dark');
    });
  });

  describe('getInitialTheme & saveManualThemeOverride', () => {
    it('should return real-time default when no manual override exists', () => {
      const daytime = new Date(2026, 8, 19, 11, 0, 0);
      expect(getInitialTheme(daytime)).toBe('light');

      const nighttime = new Date(2026, 8, 19, 22, 0, 0);
      expect(getInitialTheme(nighttime)).toBe('dark');
    });

    it('should save manual override with current date and prioritize it for that day', () => {
      const daytime = new Date(2026, 8, 19, 11, 0, 0);
      
      // User manually overrides to dark during daytime
      saveManualThemeOverride('dark', daytime);

      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
      expect(localStorage.getItem(THEME_OVERRIDE_DATE_KEY)).toBe('2026-09-19');

      // Initial theme on same day respects the override
      expect(getInitialTheme(daytime)).toBe('dark');
    });

    it('should reset/expire manual override on the next day and revert to real-time theme', () => {
      const day1Night = new Date(2026, 8, 19, 20, 0, 0);
      
      // User manually overrides to light on night of Day 1
      saveManualThemeOverride('light', day1Night);
      expect(getInitialTheme(day1Night)).toBe('light');

      // Next day morning at 10:00 AM (Day 2)
      const day2Morning = new Date(2026, 8, 20, 10, 0, 0);
      expect(getInitialTheme(day2Morning)).toBe('light'); // Day 2 morning is naturally light

      // Next day night at 22:00 PM (Day 2) without new override
      const day2Night = new Date(2026, 8, 20, 22, 0, 0);
      expect(getInitialTheme(day2Night)).toBe('dark'); // Day 2 night reverts to dark

      // Expired override date key should be removed
      expect(localStorage.getItem(THEME_OVERRIDE_DATE_KEY)).toBeNull();
    });
  });
});
