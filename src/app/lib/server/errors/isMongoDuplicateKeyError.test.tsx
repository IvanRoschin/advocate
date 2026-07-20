import { describe, expect, it } from 'vitest';

import { isMongoDuplicateKeyError } from './isMongoDuplicateKeyError';

describe('isMongoDuplicateKeyError', () => {
  it('returns true for an error with code 11000', () => {
    expect(isMongoDuplicateKeyError({ code: 11000 })).toBe(true);
  });

  it('returns false for an error with a different code', () => {
    expect(isMongoDuplicateKeyError({ code: 500 })).toBe(false);
  });

  it('returns false for a plain Error without a code', () => {
    expect(isMongoDuplicateKeyError(new Error('boom'))).toBe(false);
  });

  it('returns false for non-object values', () => {
    expect(isMongoDuplicateKeyError(null)).toBe(false);
    expect(isMongoDuplicateKeyError(undefined)).toBe(false);
    expect(isMongoDuplicateKeyError('11000')).toBe(false);
    expect(isMongoDuplicateKeyError(11000)).toBe(false);
  });
});
