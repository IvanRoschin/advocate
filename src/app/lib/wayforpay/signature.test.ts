import crypto from 'crypto';
import { describe, expect, it } from 'vitest';

import { createWayForPaySignature } from './signature';

describe('createWayForPaySignature', () => {
  it('joins values with ";" and HMAC-MD5s them with the secret key', () => {
    const values = ['merchant', 'domain.com', 'INV-1', 1753000000, 100, 'UAH'];
    const secretKey = 'test-secret';

    const expected = crypto
      .createHmac('md5', secretKey)
      .update(values.join(';'), 'utf8')
      .digest('hex');

    expect(createWayForPaySignature(values, secretKey)).toBe(expected);
  });

  it('is deterministic for the same input', () => {
    const values = ['a', 1, 'b'];
    const signature1 = createWayForPaySignature(values, 'secret');
    const signature2 = createWayForPaySignature(values, 'secret');

    expect(signature1).toBe(signature2);
  });

  it('produces a different signature when the secret key changes', () => {
    const values = ['a', 1, 'b'];

    expect(createWayForPaySignature(values, 'secret-1')).not.toBe(
      createWayForPaySignature(values, 'secret-2')
    );
  });

  it('coerces numeric values to strings before hashing', () => {
    expect(createWayForPaySignature([1, 2, 3], 'secret')).toBe(
      createWayForPaySignature(['1', '2', '3'], 'secret')
    );
  });
});
