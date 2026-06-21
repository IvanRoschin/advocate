import 'server-only';
import { env } from '../server/env/serverEnv';

function normalizeDomain(input: string): string {
  try {
    return new URL(input).hostname;
  } catch {
    return input.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  }
}

export function getWayForPayConfig() {
  const publicUrl = env.baseUrl;

  return {
    merchantAccount: env.wayforpay.merchantAccount,
    secretKey: env.wayforpay.secretKey,
    apiUrl: env.wayforpay.url || 'https://api.wayforpay.com/api',
    publicUrl,
    merchantDomainName: normalizeDomain(
      env.wayforpay.merchantDomain || publicUrl
    ),
    serviceUrl: env.wayforpay.url || `${publicUrl}/api/wayforpay/callback`,
  } as const;
}
