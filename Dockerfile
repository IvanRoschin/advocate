# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- builder ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public build-time vars needed by next build (Cloudinary widget, base URL, etc.)
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_FACEBOOK_URL
ARG NEXT_PUBLIC_INSTAGRAM_URL
ARG NEXT_PUBLIC_ADVOCATE_PN_1
ARG NEXT_PUBLIC_ADVOCATE_PN_2
ARG NEXT_PUBLIC_ADVOCATE_EMAIL


ARG MONGODB_URI
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET
ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USER
ARG SMTP_EMAIL
ARG SMTP_PASSWORD
ARG SMTP_FROM_NAME
ARG TELEGRAM_BOT_TOKEN
ARG TELEGRAM_CHAT_ID
ARG WAYFORPAY_MERCHANT_ACCOUNT
ARG WAYFORPAY_MERCHANT_DOMAIN
ARG WAYFORPAY_SECRET_KEY
ARG WAYFORPAY_URL
ARG NEXTAUTH_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
RUN npm run build

# ---------- runner ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]