/**
 * Theme Utility (Light Theme Only)
 */

export type ThemeMode = 'light';

export const THEME_STORAGE_KEY = 'app-theme';

export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTimeBasedDefaultTheme(): ThemeMode {
  return 'light';
}

export function getInitialTheme(): ThemeMode {
  return 'light';
}

export function saveManualThemeOverride(_theme: ThemeMode, _date: Date = new Date()): void {
  // No-op in Light theme only mode
}

