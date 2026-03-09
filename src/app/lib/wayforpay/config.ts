import 'server-only';

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

function normalizeDomain(input: string): string {
  try {
    return new URL(input).hostname;
  } catch {
    return input.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  }
}

export function getWayForPayConfig() {
  const publicUrl = required('NEXT_PUBLIC_URL', process.env.NEXT_PUBLIC_URL);

  return {
    merchantAccount: required(
      'WAYFORPAY_MERCHANT_ACCOUNT',
      process.env.WAYFORPAY_MERCHANT_ACCOUNT
    ),
    secretKey: required(
      'WAYFORPAY_SECRET_KEY',
      process.env.WAYFORPAY_SECRET_KEY
    ),
    apiUrl: process.env.WAYFORPAY_API_URL || 'https://api.wayforpay.com/api',
    publicUrl,
    merchantDomainName: normalizeDomain(
      process.env.WAYFORPAY_MERCHANT_DOMAIN || publicUrl
    ),
    serviceUrl:
      process.env.WAYFORPAY_SERVICE_URL ||
      `${publicUrl}/api/wayforpay/callback`,
  } as const;
}
