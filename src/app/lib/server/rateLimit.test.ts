import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { assertRateLimit } from './rateLimit';
import { TooManyRequestsError } from './errors/httpErrors';

describe('assertRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows calls under the limit', () => {
    const key = `test-under-${Math.random()}`;

    expect(() =>
      assertRateLimit(key, { limit: 3, windowMs: 1000 })
    ).not.toThrow();
    expect(() =>
      assertRateLimit(key, { limit: 3, windowMs: 1000 })
    ).not.toThrow();
    expect(() =>
      assertRateLimit(key, { limit: 3, windowMs: 1000 })
    ).not.toThrow();
  });

  it('throws once the limit is exceeded within the window', () => {
    const key = `test-over-${Math.random()}`;

    assertRateLimit(key, { limit: 2, windowMs: 1000 });
    assertRateLimit(key, { limit: 2, windowMs: 1000 });

    expect(() => assertRateLimit(key, { limit: 2, windowMs: 1000 })).toThrow(
      TooManyRequestsError
    );
  });

  it('resets once the window has passed', () => {
    const key = `test-reset-${Math.random()}`;

    assertRateLimit(key, { limit: 1, windowMs: 1000 });
    expect(() => assertRateLimit(key, { limit: 1, windowMs: 1000 })).toThrow(
      TooManyRequestsError
    );

    vi.setSystemTime(1001);

    expect(() =>
      assertRateLimit(key, { limit: 1, windowMs: 1000 })
    ).not.toThrow();
  });

  it('tracks separate keys independently', () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;

    assertRateLimit(keyA, { limit: 1, windowMs: 1000 });
    expect(() =>
      assertRateLimit(keyB, { limit: 1, windowMs: 1000 })
    ).not.toThrow();
  });
});
