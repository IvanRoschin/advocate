import { describe, expect, it } from 'vitest';

import { formatPhone } from './formatPhone';

describe('formatPhone', () => {
  it('formats a tel: link without doubling the country code', () => {
    expect(formatPhone('tel:+380951983729')).toBe('+380 95 198 37 29');
  });

  it('formats a raw number', () => {
    expect(formatPhone('380961983729')).toBe('+380 96 198 37 29');
  });

  it('returns unknown formats unchanged', () => {
    expect(formatPhone('tel:+48123456789')).toBe('+48123456789');
  });
});
