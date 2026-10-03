import { describe, it, expect } from 'vitest';
import {
  normalizeCategoryColor,
  getCategoryColorClasses,
  FLOWBITE_CATEGORY_COLORS,
} from '../categoryColors';

describe('categoryColors Utility', () => {
  it('defines the standard Flowbite color palette', () => {
    expect(FLOWBITE_CATEGORY_COLORS.length).toBe(10);
    const ids = FLOWBITE_CATEGORY_COLORS.map((c) => c.id);
    expect(ids).toContain('blue');
    expect(ids).toContain('green');
    expect(ids).toContain('yellow');
    expect(ids).toContain('purple');
    expect(ids).toContain('pink');
    expect(ids).toContain('red');
    expect(ids).toContain('indigo');
    expect(ids).toContain('cyan');
    expect(ids).toContain('teal');
    expect(ids).toContain('gray');
  });

  it('normalizes valid Flowbite color names directly', () => {
    expect(normalizeCategoryColor('blue')).toBe('blue');
    expect(normalizeCategoryColor('green')).toBe('green');
    expect(normalizeCategoryColor('purple')).toBe('purple');
    expect(normalizeCategoryColor('pink')).toBe('pink');
    expect(normalizeCategoryColor('YELLOW')).toBe('yellow');
  });

  it('normalizes legacy hex codes into corresponding Flowbite color names', () => {
    expect(normalizeCategoryColor('#3B82F6')).toBe('blue');
    expect(normalizeCategoryColor('#10B981')).toBe('green');
    expect(normalizeCategoryColor('#F59E0B')).toBe('yellow');
    expect(normalizeCategoryColor('#8B5CF6')).toBe('purple');
    expect(normalizeCategoryColor('#EC4899')).toBe('pink');
    expect(normalizeCategoryColor('#EF4444')).toBe('red');
    expect(normalizeCategoryColor('#6366F1')).toBe('indigo');
    expect(normalizeCategoryColor('#06B6D4')).toBe('cyan');
    expect(normalizeCategoryColor('#14B8A6')).toBe('teal');
    expect(normalizeCategoryColor('#6B7280')).toBe('gray');
  });

  it('falls back to "blue" for null, undefined, or unknown colors', () => {
    expect(normalizeCategoryColor(null)).toBe('blue');
    expect(normalizeCategoryColor(undefined)).toBe('blue');
    expect(normalizeCategoryColor('')).toBe('blue');
    expect(normalizeCategoryColor('unknown-color')).toBe('blue');
  });

  it('returns valid Tailwind and Flowbite CSS classes for badge, borderTop, and iconBg', () => {
    const blueClasses = getCategoryColorClasses('blue');
    expect(blueClasses.borderTop).toContain('border-t-blue-500');
    expect(blueClasses.badge).toContain('bg-blue-50');
    expect(blueClasses.badge).toContain('text-blue-700');
    expect(blueClasses.iconBg).toContain('bg-blue-100');

    const greenClasses = getCategoryColorClasses('#10B981');
    expect(greenClasses.id).toBe('green');
    expect(greenClasses.borderTop).toContain('border-t-emerald-500');
    expect(greenClasses.badge).toContain('bg-emerald-50');

    const purpleClasses = getCategoryColorClasses('purple');
    expect(purpleClasses.borderTop).toContain('border-t-purple-500');
    expect(purpleClasses.badge).toContain('bg-purple-50');
  });
});
