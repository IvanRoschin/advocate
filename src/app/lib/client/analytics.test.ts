import { describe, expect, it } from 'vitest';

import { contactMethodFromHref } from './analytics';

describe('contactMethodFromHref', () => {
  it.each([
    ['tel:+380951983729', 'phone'],
    ['mailto:a@b.ua', 'email'],
    ['https://t.me/ivanroschin', 'telegram'],
    ['viber://chat?number=%2B380967759569', 'viber'],
    ['/services', null],
    ['https://instagram.com/x', null],
  ])('%s -> %s', (href, expected) => {
    expect(contactMethodFromHref(href)).toBe(expected);
  });
});
