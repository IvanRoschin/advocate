import crypto from 'crypto';
import 'server-only';

export function createWayForPaySignature(
  values: Array<string | number>,
  secretKey: string
): string {
  const payload = values.map(value => String(value)).join(';');

  return crypto
    .createHmac('md5', secretKey)
    .update(payload, 'utf8')
    .digest('hex');
}
