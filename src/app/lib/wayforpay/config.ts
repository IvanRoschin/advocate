import 'server-only';

import { serverEnv } from '../server/env/serverEnv';

function normalizeDomain(input: string): string {
  try {
    return new URL(input).hostname;
  } catch {
    return input.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  }
}

function required(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export function getWayForPayConfig() {
  return {
    merchantAccount: required(
      serverEnv.wayforpay.merchantAccount,
      'WAYFORPAY_MERCHANT_ACCOUNT'
    ),
    secretKey: required(serverEnv.wayforpay.secretKey, 'WAYFORPAY_SECRET_KEY'),
    apiUrl:
      required(serverEnv.wayforpay.url, 'WAYFORPAY_URL') ||
      'https://api.wayforpay.com/api',
    publicUrl: serverEnv.baseUrl,
    merchantDomainName: normalizeDomain(
      required(
        serverEnv.wayforpay.merchantDomain,
        'WAYFORPAY_MERCHANT_DOMAIN'
      ) || required(serverEnv.baseUrl, 'NEXT_PUBLIC_URL')
    ),
    serviceUrl:
      serverEnv.wayforpay.url || `${serverEnv.baseUrl}/api/wayforpay/callback`,
  } as const;
}
