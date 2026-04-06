// src/app/config/routes.ts

export const routes = {
  public: {
    home: '/',
    about: '/#about',
    practices: '/#practices',
    order: '/#order',
    services: '/services',
    blog: '/blog',
    payments: '/payments',
    contact: '/contact',
    notFound: '/not-found',
    privacyPolicy: '/privacy-policy',
    offer: '/offer',
    dashboard: '/signin',

    auth: {
      verifyEmail: '/verify-email',
      signIn: '/signin',
      forgotPassword: '/forgot-password',
      restorePassword: '/restore-password',
    },
  },

  blog: {
    index: '/blog',
    article: (slug: string) => `/blog/${slug}`,
    tag: (tag: string) => `/blog/tag/${tag}`,
    category: (slug: string) => `/blog/category/${slug}`,
  },

  api: {
    admin: {
      articles: '/api/admin/articles',
      categories: '/api/admin/categories',
      dashboard: '/api/admin/dashboard',
      leads: '/api/admin/leads',
      reviews: '/api/admin/reviews',
      subscribe: '/api/admin/subscribe',
      users: '/api/admin/users',
    },
    v1: {
      articles: '/api/v1/articles',
      auth: {
        restorePassword: '/api/v1/auth/forgot-password',
        resetPassword: '/api/v1/auth/reset-password',
      },
      categories: '/api/v1/categories',
      cloudinary: {
        sign: '/api/v1/cloudinary/sign',
      },
      leads: '/api/v1/leads',
      reviews: '/api/v1/reviews',
      services: (slug: string) => `/api/v1/services/${slug}`,
      subscribe: '/api/v1/subscribe',
      comments: '/api/v1/comments',
    },
  },

  admin: {
    dashboard: '/admin',
    users: '/admin/users',

    content: {
      articles: '/admin/articles',
      categories: '/admin/categories',
      services: '/admin/services',
      tags: '/admin/tags',
    },

    crm: {
      leads: '/admin/leads',
      clients: '/admin/clients',
    },

    finance: {
      payments: '/admin/payments',
    },

    ui: {
      reviews: '/admin/reviews',
      slides: '/admin/slides',
      pageSettings: '/admin/page-settings/article',
    },
  },

  client: {
    dashboard: '/client',
    cases: '/client/cases',
    profile: '/client/profile',
    documents: '/client/documents',
    messages: '/client/messages',
    access: '/client/access',
    settings: {
      changePassword: '/client/settings/change-password',
    },
  },
} as const;

// ---------- Types ----------
export type PublicRoutes = typeof routes.public;
export type AuthRoutes = typeof routes.public.auth;

export type BlogRoutes = typeof routes.blog;

export type ApiRoutes = typeof routes.api.v1;
export type ApiRouteKey = keyof typeof routes.api.v1;

export type AdminRoutes = typeof routes.admin;

export type AdminStringRouteKey = {
  [K in keyof AdminRoutes]: AdminRoutes[K] extends string ? K : never;
}[keyof AdminRoutes];

export type PublicStringRouteKey = {
  [K in keyof PublicRoutes]: PublicRoutes[K] extends string ? K : never;
}[keyof PublicRoutes];

// ---------- Helpers ----------
export const baseUrl =
  process.env.NEXT_PUBLIC_PUBLIC_URL?.replace(/\/$/, '') ??
  'http://localhost:3000';

export const apiUrl = (path: string) => {
  const base = baseUrl.replace(/\/$/, '');
  const p = path.replace(/^\//, '');
  return `${base}/${p}`;
};

export const protectedRoutes = [
  routes.admin.dashboard,
  routes.client.dashboard,
];

// ✅ теперь типобезопасно: route не может быть 'auth'
export const getRouteUrl = (route: PublicStringRouteKey): string => {
  return routes.public[route];
};
