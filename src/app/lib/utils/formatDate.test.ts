import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatDate } from './formatDate';

describe('formatDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-20T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats a plain date without the relative suffix by default', () => {
    expect(formatDate('2026-07-20')).toBe('20 липня 2026 р.');
  });

  it('marks the current date as "Сьогодні"', () => {
    expect(formatDate('2026-07-20', true)).toBe('20 липня 2026 р. (Сьогодні)');
  });

  it('marks yesterday as "Вчора"', () => {
    expect(formatDate('2026-07-19', true)).toBe('19 липня 2026 р. (Вчора)');
  });

  it('uses the correct plural form for a small number of days', () => {
    expect(formatDate('2026-07-17', true)).toBe('17 липня 2026 р. (3 дні тому)');
  });

  it('uses the "днів" plural form for 11-14 days (genitive exception)', () => {
    expect(formatDate('2026-07-08', true)).toBe('8 липня 2026 р. (12 днів тому)');
  });

  it('uses the "день" singular form for numbers ending in 1 (excluding 11)', () => {
    expect(formatDate('2026-06-29', true)).toBe('29 червня 2026 р. (21 день тому)');
  });
});
