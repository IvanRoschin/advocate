// src/app/config/routes.ts
export const routes = {
  publicRoutes: {
    home: '/',
    about: '#about',
    practices: '#practices',
    order: '#order',
    blog: '/blog',
    payments: '/payments',
    contact: '/contact',
    page404: '/not-found',
  },
  apiRoutes: {
    leads: '/api/leads',
    subscribe: '/api/subscribe',
  },
  adminRoutes: {
    dashboard: '/admin',
    leads: '/admin/leads',
    clients: '/admin/clients',
    categories: '/admin/categories',
    payments: '/admin/payments',
    testimonials: '/admin/testimonials',
    slides: '/admin/slides',
  },
} as const;

// -----------------------------
// Types for safety
export type PublicRoute = keyof typeof routes.publicRoutes;
export type ApiRoute = keyof typeof routes.apiRoutes;
export type AdminRoute = keyof typeof routes.adminRoutes;

// -----------------------------
// Base URL (prod or localhost)
export const baseUrl =
  process.env.NEXT_PUBLIC_PUBLIC_URL?.replace(/\/$/, '') ||
  'http://localhost:3000';

// -----------------------------
// Helpers
export const getRoute = (route: PublicRoute | AdminRoute): string => {
  if (route in routes.publicRoutes)
    return routes.publicRoutes[route as PublicRoute];
  if (route in routes.adminRoutes)
    return routes.adminRoutes[route as AdminRoute];
  throw new Error(`Route "${route}" does not exist`);
};

export const apiUrl = (route: ApiRoute) =>
  `${baseUrl}${routes.apiRoutes[route]}`;
