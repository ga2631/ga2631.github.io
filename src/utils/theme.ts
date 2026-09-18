/**
 * Real-time Day/Night Theme & Daily Manual Override Utility
 * 
 * Rules:
 * 1. Default based on real-time hour:
 *    - Daytime (06:00 to 17:59): Light Theme
 *    - Nighttime (18:00 to 05:59): Dark Theme
 * 2. User manual override:
 *    - When the user manually switches theme, save the choice and the override date (YYYY-MM-DD).
 *    - The manual choice persists for the rest of that day.
 * 3. Next day reset:
 *    - On the next day (or different date), the manual override is expired and the real-time theme takes effect again.
 */

export type ThemeMode = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'app-theme';
export const THEME_OVERRIDE_DATE_KEY = 'app-theme-override-date';

/**
 * Formats a Date object to YYYY-MM-DD local date string.
 */
export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns 'light' for daytime (06:00 - 17:59) and 'dark' for nighttime (18:00 - 05:59).
 */
export function getTimeBasedDefaultTheme(date: Date = new Date()): ThemeMode {
  const hours = date.getHours();
  return hours >= 6 && hours < 18 ? 'light' : 'dark';
}

/**
 * Retrieves the effective initial theme considering daily manual overrides and real-time.
 */
export function getInitialTheme(date: Date = new Date()): ThemeMode {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const overrideDate = localStorage.getItem(THEME_OVERRIDE_DATE_KEY);
    const today = getTodayDateString(date);

    // If user explicitly chose a theme today, respect it
    if (overrideDate === today && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }

    // If override is from a previous day, remove expired override
    if (overrideDate && overrideDate !== today) {
      localStorage.removeItem(THEME_OVERRIDE_DATE_KEY);
    }

    // Default to real-time day/night theme
    return getTimeBasedDefaultTheme(date);
  } catch {
    return getTimeBasedDefaultTheme(date);
  }
}

/**
 * Persists user's manual theme selection for the current day.
 */
export function saveManualThemeOverride(theme: ThemeMode, date: Date = new Date()): void {
  try {
    const today = getTodayDateString(date);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(THEME_OVERRIDE_DATE_KEY, today);
  } catch (e) {
    console.warn('Failed to save manual theme override to localStorage', e);
  }
}
