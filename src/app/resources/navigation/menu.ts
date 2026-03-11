import type { PublicStringRouteKey } from '@/app/config/routes';

export type MenuItem = {
  title: string;
  route: PublicStringRouteKey;
};

export const mainMenu = [
  { title: 'Головна', route: 'home' },
  { title: 'Про мене', route: 'about' },
  { title: 'Практики', route: 'practices' },
  { title: 'Послуги', route: 'services' },
  { title: 'Блог', route: 'blog' },
  { title: 'Оплата послуг', route: 'payments' },
  { title: 'Контакти', route: 'contact' },
] satisfies MenuItem[];

export const menuText = {
  navAria: 'Навігація',
  burgerAria: 'Меню',
  closeAria: 'Закрити меню',
  closeOverlay: 'Закрити меню',
  mobileMenuAria: 'Мобільне меню',
  cta: 'Записатись на консультацію',
  ctaRoute: 'order',
} as const;
