function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

export const env = {
  // Public Host
  baseUrl:
    process.env.NEXT_PUBLIC_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000',

  // Public advocate data
  advocateEmail: required(
    process.env.NEXT_PUBLIC_ADVOCATE_EMAIL,
    'NEXT_PUBLIC_ADVOCATE_EMAIL'
  ),
  advocatePhone1: process.env.NEXT_PUBLIC_ADVOCATE_PN_1,
  advocatePhone2: process.env.NEXT_PUBLIC_ADVOCATE_PN_2,

  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL,

  // Database
  mongoUri: required(process.env.MONGODB_URI, 'MONGODB_URI'),

  // SMTP
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
    fromName: process.env.SMTP_FROM_NAME,
  },

  // Telegram
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // WayForPay
  wayforpay: {
    merchantAccount: required(
      process.env.WAYFORPAY_MERCHANT_ACCOUNT,
      'WAYFORPAY_MERCHANT_ACCOUNT'
    ),
    merchantDomain: process.env.WAYFORPAY_MERCHANT_DOMAIN,
    secretKey: required(
      process.env.WAYFORPAY_SECRET_KEY,
      'WAYFORPAY_SECRET_KEY'
    ),
    url: process.env.WAYFORPAY_URL,
  },

  // Auth
  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
  },

  // Google
  google: {
    clientId: required(process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID'),
    clientSecret: required(
      process.env.GOOGLE_CLIENT_SECRET,
      'GOOGLE_CLIENT_SECRET'
    ),
  },

  // Cloudflare
  cloudflare: {
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
  },
};
