export const serverEnv = {
  baseUrl:
    process.env.NEXT_PUBLIC_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000',

  advocateEmail: process.env.NEXT_PUBLIC_ADVOCATE_EMAIL,
  advocatePhone1: process.env.NEXT_PUBLIC_ADVOCATE_PN_1,
  advocatePhone2: process.env.NEXT_PUBLIC_ADVOCATE_PN_2,

  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL,

  mongoUri: process.env.MONGODB_URI,

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
    fromName: process.env.SMTP_FROM_NAME,
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },

  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  wayforpay: {
    merchantAccount: process.env.WAYFORPAY_MERCHANT_ACCOUNT,
    merchantDomain: process.env.WAYFORPAY_MERCHANT_DOMAIN,
    secretKey: process.env.WAYFORPAY_SECRET_KEY,
    url: process.env.WAYFORPAY_URL,
  },

  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  cloudflare: {
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,
  },
};
