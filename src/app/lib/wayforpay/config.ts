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

export const wayForPayConfig = {
  merchantAccount: required(
    'WAYFORPAY_MERCHANT_ACCOUNT',
    process.env.WAYFORPAY_MERCHANT_ACCOUNT
  ),
  secretKey: required('WAYFORPAY_SECRET_KEY', process.env.WAYFORPAY_SECRET_KEY),
  apiUrl: process.env.WAYFORPAY_API_URL || 'https://api.wayforpay.com/api',
  publicUrl: required('PUBLIC_URL', process.env.NEXT_PUBLIC_URL),
  merchantDomainName: normalizeDomain(
    process.env.WAYFORPAY_MERCHANT_DOMAIN || process.env.NEXT_PUBLIC_URL || ''
  ),
  serviceUrl:
    process.env.WAYFORPAY_SERVICE_URL ||
    `${required('PUBLIC_URL', process.env.NEXT_PUBLIC_URL)}/api/wayforpay/callback`,
} as const;
