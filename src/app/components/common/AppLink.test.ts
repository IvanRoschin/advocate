import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/store/loading.store', () => ({ useLoadingStore: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname: vi.fn() }));

import { isAppSchemeHref } from './AppLink';

describe('isAppSchemeHref', () => {
  it('detects app/protocol links', () => {
    expect(isAppSchemeHref('viber://chat?number=%2B380951983729')).toBe(true);
    expect(isAppSchemeHref('tel:+380951983729')).toBe(true);
    expect(isAppSchemeHref('mailto:a@b.c')).toBe(true);
  });

  it('ignores http and internal links', () => {
    expect(isAppSchemeHref('https://t.me/ivanroschin')).toBe(false);
    expect(isAppSchemeHref('/contact')).toBe(false);
    expect(isAppSchemeHref(undefined)).toBe(false);
  });
});
