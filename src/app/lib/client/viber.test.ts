import { describe, expect, it } from 'vitest';

import { viberNumberFromHref } from './viber';

describe('viberNumberFromHref', () => {
  it('decodes the number from a viber chat link', () => {
    expect(viberNumberFromHref('viber://chat?number=%2B380951983729')).toBe(
      '+380951983729'
    );
  });

  it('returns null when there is no number', () => {
    expect(viberNumberFromHref('viber://forward?text=hi')).toBeNull();
  });
});
