import 'server-only';
import { env } from '../server/env/serverEnv';

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
      env.wayforpay.merchantAccount,
      'WAYFORPAY_MERCHANT_ACCOUNT'
    ),
    secretKey: required(env.wayforpay.secretKey, 'WAYFORPAY_SECRET_KEY'),
    apiUrl:
      required(env.wayforpay.url, 'WAYFORPAY_URL') ||
      'https://api.wayforpay.com/api',
    publicUrl: env.baseUrl,
    merchantDomainName: normalizeDomain(
      required(env.wayforpay.merchantDomain, 'WAYFORPAY_MERCHANT_DOMAIN') ||
        required(env.baseUrl, 'NEXT_PUBLIC_URL')
    ),
    serviceUrl: env.wayforpay.url || `${env.baseUrl}/api/wayforpay/callback`,
  } as const;
}
