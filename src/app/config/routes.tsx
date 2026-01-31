// src/app/config/routes.ts

export const routes = {
  public: {
    home: '/',
    about: '#about',
    practices: '#practices',
    order: '#order',
    payments: '/payments',
    contact: '/contact',
    notFound: '/not-found',

    auth: {
      verifyEmail: '/auth/verify-email',
      signIn: '/auth/signin',
      forgotPassword: '/auth/forgot-password',
      restorePassword: '/auth/restore-password',
    },

    blog: {
      index: '/blog',
      article: (slug: string) => `/blog/${slug}`,
      tag: (tag: string) => `/blog/tag/${tag}`,
      category: (slug: string) => `/blog/category/${slug}`,
    },
  },

  api: {
    v1: {
      leads: '/api/v1/leads',
      subscribe: '/api/v1/subscribe',
      categories: '/api/v1/categories',
      articles: '/api/v1/articles',
      comments: '/api/v1/comments',
      cloudinary: {
        sign: '/api/v1/cloudinary/sign',
      },
    },
  },

  admin: {
    dashboard: '/admin',

    content: {
      articles: '/admin/articles',
      categories: '/admin/categories',
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
      testimonials: '/admin/testimonials',
      slides: '/admin/slides',
    },
  },

  client: {
    dashboard: '/client',
  },
} as const;

export type PublicRoutes = typeof routes.public;
export type ApiRoutes = typeof routes.api.v1;
export type AdminRoutes = typeof routes.admin;

export type ApiRouteKey = keyof typeof routes.api.v1;

export const baseUrl =
  process.env.NEXT_PUBLIC_PUBLIC_URL?.replace(/\/$/, '') ??
  'http://localhost:3000';

export const apiUrl = (path: string) => `${baseUrl}${path}`;

export const protectedRoutes = [
  routes.admin.dashboard,
  routes.client.dashboard,
];

export type PublicRouteKey = keyof typeof routes.public;

export const getRouteUrl = (route: PublicRouteKey): string => {
  if (route === 'blog') return routes.public.blog.index;
  const r = routes.public[route];
  // r может быть строкой или объектом (только для blog уже обработано выше)
  if (typeof r === 'string') return r;
  throw new Error(`Route "${route}" is not a valid public string route`);
};
