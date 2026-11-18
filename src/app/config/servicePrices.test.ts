import { describe, expect, it } from 'vitest';

import {
  formatServicePrice,
  getServicePrice,
  SERVICE_PRICES,
} from './servicePrices';

describe('servicePrices', () => {
  it('formats a price with thousands separator', () => {
    expect(formatServicePrice({ from: 20000 })).toBe('від 20 000 грн');
  });

  it('adds unit when present', () => {
    expect(formatServicePrice({ from: 500, unit: 'год' })).toBe(
      'від 500 грн / год'
    );
  });

  it('returns undefined for unknown or empty slug', () => {
    expect(getServicePrice('unknown')).toBeUndefined();
    expect(getServicePrice(undefined)).toBeUndefined();
  });

  it('has positive prices for all configured services', () => {
    for (const price of Object.values(SERVICE_PRICES)) {
      expect(price.from).toBeGreaterThan(0);
    }
  });
});
