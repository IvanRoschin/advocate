import { routes } from '@/app/config/routes';
import { iconLibrary } from '@/resources';

import type { NavItem } from './nav.types';

// Anonymous visitors only ever need this — split out from admin/client/manager
// so the public bundle (every homepage/marketing page) doesn't have to pull
// in signOut, admin routes, or client-portal nav data. See nav.private.ts.
export const PUBLIC_NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'home',
    href: routes.public.home,
    label: 'Головна',
    Icon: iconLibrary.home,
  },
  {
    key: 'about',
    href: routes.public.about,
    label: 'Про мене',
    Icon: iconLibrary.about,
  },
  {
    key: 'practices',
    href: routes.public.practices,
    label: 'Практики',
    Icon: iconLibrary.practices,
    startsWith: true,
  },
  {
    key: 'services',
    href: routes.public.services,
    label: 'Послуги',
    Icon: iconLibrary.services,
    startsWith: true,
  },
  {
    key: 'blog',
    href: routes.public.blog,
    label: 'Блог',
    Icon: iconLibrary.blog,
    startsWith: true,
  },
  {
    key: 'payments',
    href: routes.public.payments,
    label: 'Оплата',
    Icon: iconLibrary.payments,
    startsWith: true,
  },
  {
    key: 'contact',
    href: routes.public.contact,
    label: 'Контакти',
    Icon: iconLibrary.contact,
  },
];

export const PUBLIC_NAV_MOBILE_ITEMS: readonly NavItem[] = [
  {
    key: 'home',
    href: routes.public.home,
    label: 'Головна',
    Icon: iconLibrary.home,
  },
  {
    key: 'services',
    href: routes.public.services,
    label: 'Послуги',
    Icon: iconLibrary.services,
    startsWith: true,
  },
  {
    key: 'blog',
    href: routes.public.blog,
    label: 'Блог',
    Icon: iconLibrary.blog,
    startsWith: true,
  },
  {
    key: 'payments',
    href: routes.public.payments,
    label: 'Оплата',
    Icon: iconLibrary.payments,
    startsWith: true,
  },
  {
    key: 'contact',
    href: routes.public.contact,
    label: 'Контакти',
    Icon: iconLibrary.contact,
  },
];
