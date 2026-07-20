import { describe, expect, it } from 'vitest';

import { normalizePhoneUA } from './normalizePhone';

describe('normalizePhoneUA', () => {
  it('normalizes a local 0XXXXXXXXX number', () => {
    expect(normalizePhoneUA('0961983729')).toBe('+380961983729');
  });

  it('normalizes a full 380XXXXXXXXX number', () => {
    expect(normalizePhoneUA('380961983729')).toBe('+380961983729');
  });

  it('normalizes an already-prefixed +380XXXXXXXXX number', () => {
    expect(normalizePhoneUA('+380961983729')).toBe('+380961983729');
  });

  it('strips spaces, dashes and parentheses before normalizing', () => {
    expect(normalizePhoneUA('+380 (96) 198-37-29')).toBe('+380961983729');
    expect(normalizePhoneUA('0 96 198 37 29')).toBe('+380961983729');
  });

  it('returns the trimmed input unchanged for unrecognized formats', () => {
    expect(normalizePhoneUA('  12345  ')).toBe('12345');
    expect(normalizePhoneUA('not a phone')).toBe('not a phone');
  });
});
