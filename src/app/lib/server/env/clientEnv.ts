export const clientEnv = {
  baseUrl:
    process.env.NEXT_PUBLIC_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000',

  advocateEmail: process.env.NEXT_PUBLIC_ADVOCATE_EMAIL,
  advocatePhone1: process.env.NEXT_PUBLIC_ADVOCATE_PN_1,
  advocatePhone2: process.env.NEXT_PUBLIC_ADVOCATE_PN_2,

  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL,

  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  },

  wayforpay: {
    merchantAccount: process.env.WAYFORPAY_MERCHANT_ACCOUNT,
    merchantDomain: process.env.WAYFORPAY_MERCHANT_DOMAIN,
    url: process.env.WAYFORPAY_URL,
  },

  cloudflare: {
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
};
