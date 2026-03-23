# ⚖️ Advocate

<p align="center">
  <b>Fullstack Legal Platform</b><br/>
  Modern web platform for legal services, content management and client interaction.
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-UI-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-NextAuth-000000" />
  <img src="https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" />
</p>

---

## ✨ Overview

**Advocate** — это production-ready fullstack приложение для юридических услуг.

Система объединяет:
- публичный сайт
- блог
- управление услугами
- админ-панель
- отзывы
- клиентский кабинет

Проект построен с акцентом на:
- ⚡ производительность
- 🧠 чистую архитектуру
- 🔒 безопасность
- 🧩 масштабируемость

---

## 🚀 Features

### Public Platform
- 📰 Blog (articles, categories, SEO)
- ⚖️ Services pages (modular layout sections)
- 🔍 Related content & navigation
- 📱 Fully responsive UI
- 🌙 Dark / light mode

### Admin Panel
- CRUD for services, articles, categories
- Review moderation system
- Image upload (Cloudinary)
- Data tables & actions

### Client Features
- Role-based access
- Protected routes
- Personalized flows

### UX / UI
- Smooth animations (Framer Motion)
- Adaptive mobile navigation
- Scroll interactions
- Optimized image delivery

---

## 🧱 Architecture

### High-level flow

```
Client (Browser)
      ↓
Next.js App (App Router)
      ↓
API Routes (route.ts)
      ↓
Services Layer (business logic)
      ↓
Repositories Layer (DB access)
      ↓
MongoDB
```

### Media pipeline

```
Upload Widget
      ↓
Cloudinary (store original)
      ↓
Save publicId
      ↓
Helper (transform)
      ↓
Responsive images (card / hero)
```

### 📁 Project Structure

```
src/
├─ app/
│  ├─ api/
│  ├─ components/
│  ├─ lib/
│  │  ├─ services/
│  │  ├─ repositories/
│  │  └─ cloudinary/
│  └─ ...
├─ components/
├─ hooks/
├─ store/
└─ types/
   ├─ article/
   ├─ service/
   └─ ...
```

### 🧠 Type System

```
Все типы централизованы по сущностям:

/types/<entity>/
  index.ts
  *.dto.ts
  *.forms.ts
  *.mapper.ts
```

Пример:

```
export * from './service.dto';
export * from './service.forms';
export * from './service.mapper';
```

### ⚙️ Getting Started

```
npm install
```

### Run dev server

```
npm run dev
```

### Open:

```
[npm run dev](http://localhost:3000)
```

### 🔐 Environment Variables
```
</> env

MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

### 🖼 Media / Cloudinary

Подход:

upload → оригинал (без resize)
хранение → publicId
render → через helper

Пример:

```
getArticleImageUrl(id, 'card')
getServiceImageUrl(id, 'hero')
```

### 🧪 Validation
Formik (forms)
Yup (validation)
DTO + mapper layer

### 🧑‍💻 Development Rules
❌ no any
❌ no business logic in route.ts
❌ no DB calls outside repository
✅ strict typing
✅ clean architecture
✅ minimal abstractions

### 📦 Scripts

```
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

### 🚀 Deployment
Recommended:

Vercel
MongoDB Atlas
Cloudinary

Build:

```
npm run build
npm run start
```

### 📌 Roadmap

 Search
 Pagination
 SEO improvements
 Caching / ISR
 Analytics

### 🧑‍⚖️ Author

Fullstack legal platform focused on performance, scalability and clean architecture.

### 📄 License
MIT


 


```
