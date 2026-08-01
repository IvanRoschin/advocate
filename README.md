# ⚖️ Advocate

<p align="center">
  <b>Fullstack Legal Services Platform</b><br/>
  Public website, blog, service catalog, admin panel and client portal for a law practice.
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#environment-variables">Environment</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-NextAuth-000000" />
  <img src="https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Bot_protection-Turnstile-F38020?logo=cloudflare&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Docker%20%2B%20Caddy-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" />
</p>

---

## ✨ Overview

**Advocate** is a production fullstack platform for a law practice, combining:

- Public marketing site with service pages and a blog
- SEO-focused content (dynamic sitemap, structured metadata, legacy-URL redirects)
- Admin panel for managing services, articles, categories and reviews
- Client portal with role-based access
- Lead capture, subscriptions, reviews and paid consultations (WayForPay)

Built with an emphasis on:

- ⚡ Performance — App Router, server components, optimized media delivery
- 🧠 Clean architecture — actions → services → repositories, no leaking business logic into routes
- 🔒 Security — nonce-based CSP, bot protection, role-gated middleware
- 🧩 Type safety — DTO/mapper layer per domain entity, no `any`

---

## 🚀 Features

### Public Platform

- 📰 Blog (articles, categories, tags, related content, SEO metadata)
- ⚖️ Service pages built from modular, DB-driven layout sections
- 💳 Paid consultations via WayForPay
- 🤖 Cloudflare Turnstile on every public form (leads, subscriptions, reviews)
- 📱 Fully responsive, dark / light mode
- 🗺️ Auto-generated `sitemap.xml` / `robots.txt`, 301 redirects from legacy URLs

### Admin Panel

- CRUD for services, articles, categories, tags, slides
- Review moderation
- Lead and subscriber management (CRM-lite)
- Image upload via Cloudinary widget

### Client Portal

- Role-based access (client / manager / admin)
- Case, document and message views
- Account and access recovery flows

### Integrations

- 📧 Transactional email via SMTP (Nodemailer)
- 💬 Telegram notifications for new leads
- 🔑 Auth via credentials and Google OAuth (NextAuth)

---

## 🧱 Architecture

### Request flow

```
Client (Browser)
      ↓
Next.js App Router (middleware: auth guard + CSP nonce)
      ↓
Server Actions / API Routes (route.ts)
      ↓
Services Layer (business logic)
      ↓
Repositories Layer (Mongoose models)
      ↓
MongoDB (Atlas)
```

### Media pipeline

```
Upload widget → Cloudinary (original stored)
             → publicId saved on the document
             → helper resolves a transformed URL at render time
                 getServiceImageUrl(id, 'hero')
                 getArticleImageUrl(id, 'card')
```

### Project structure

```
src/
├─ app/
│  ├─ (public)/        # marketing site, blog, services, contact
│  ├─ admin/           # admin panel
│  ├─ client/          # client portal
│  ├─ api/             # route handlers
│  ├─ actions/         # server actions (thin, delegate to services)
│  ├─ lib/
│  │  ├─ services/     # business logic
│  │  ├─ repositories/ # DB access
│  │  └─ cloudinary/
│  ├─ models/          # Mongoose schemas
│  └─ components/
├─ proxy.ts            # middleware: route guards + per-request CSP nonce
└─ types/
   └─ <entity>/
      ├─ index.ts
      ├─ *.dto.ts
      ├─ *.forms.ts
      └─ *.mapper.ts
```

### Type system

Types are centralized per domain entity and re-exported from a single barrel:

```ts
// types/service/index.ts
export * from './service.dto';
export * from './service.forms';
export * from './service.mapper';
```

### Development rules

- ❌ No `any`
- ❌ No business logic in `route.ts` — routes delegate to the services layer
- ❌ No direct DB calls outside repositories
- ✅ Strict typing end to end (DTO → mapper → UI)
- ✅ Minimal abstractions — no speculative layers

---

## ⚙️ Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Environment Variables

```env
# App
NEXT_PUBLIC_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Database
MONGODB_URI=

# Auth (Google)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=
SMTP_FROM_NAME=

# Telegram notifications
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# WayForPay
WAYFORPAY_MERCHANT_ACCOUNT=
WAYFORPAY_MERCHANT_DOMAIN=
WAYFORPAY_SECRET_KEY=
WAYFORPAY_URL=
```

---

## 🧪 Testing & Quality

```bash
npm run test        # Vitest
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run knip         # unused code / exports
```

Forms use **Formik** + **Yup**, validated against the same DTO layer used server-side. Git hooks (Husky + lint-staged) run linting and formatting on commit.

---

## 📦 Scripts

```bash
npm run dev         # start dev server (Turbopack)
npm run build        # production build
npm run start        # start production server
npm run lint          # eslint --fix
npm run typecheck    # type-check only
npm run test          # run tests
npm run format        # prettier --write
```

---

## 🚀 Deployment

Self-hosted via **Docker Compose**, behind **Caddy** for automatic HTTPS (Let's Encrypt) and reverse proxying — no separate nginx/certbot setup required.

```bash
git pull
docker compose up -d --build
```

- `Dockerfile` — multi-stage build, Next.js `standalone` output
- `docker-compose.yml` — app container + Caddy reverse proxy, runtime secrets from `.env`
- `Caddyfile` — domain routing + TLS

Database (MongoDB Atlas) and media (Cloudinary) are managed cloud services — the app server itself is stateless and disposable.

---

## 📌 Roadmap

- Search across services and articles
- Pagination for blog/admin lists
- ISR / caching for public pages
- Analytics dashboard

---

## 📄 License

MIT
