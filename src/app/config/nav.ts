import type { IconType } from 'react-icons';

import { routes } from '@/app/config/routes';
import { iconLibrary, menuText } from '@/resources';

export type NavScope = 'public' | 'admin' | 'client';

export type NavItem = {
  key: string;
  href: string;
  label: string;
  Icon: IconType;
  startsWith?: boolean;
  enabled?: boolean;
};

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
    label: 'Оплата послуг',
    Icon: iconLibrary.payments,
  },
  {
    key: 'contact',
    href: routes.public.contact,
    label: 'Контакти',
    Icon: iconLibrary.contact,
  },
];

export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'dashboard',
    href: routes.admin.dashboard,
    label: 'Головна',
    Icon: iconLibrary.home,
  },
  {
    key: 'users',
    href: routes.admin.users,
    label: 'Користувачі',
    Icon: iconLibrary.user,
    startsWith: true,
  },
  {
    key: 'articles',
    href: routes.admin.content.articles,
    label: 'Статті',
    Icon: iconLibrary.blog,
    startsWith: true,
  },
  {
    key: 'categories',
    href: routes.admin.content.categories,
    label: 'Категорії',
    Icon: iconLibrary.folder,
    startsWith: true,
  },
  {
    key: 'services',
    href: routes.admin.content.services,
    label: 'Послуги',
    Icon: iconLibrary.services,
    startsWith: true,
  },
  {
    key: 'leads',
    href: routes.admin.crm.leads,
    label: 'Ліди',
    Icon: iconLibrary.inbox,
    startsWith: true,
  },
  {
    key: 'Клієнти',
    href: routes.admin.crm.clients,
    label: 'Клієнти',
    Icon: iconLibrary.clients,
    startsWith: true,
  },
  {
    key: 'payments',
    href: routes.admin.finance.payments,
    label: 'Оплати',
    Icon: iconLibrary.payments,
    startsWith: true,
  },
];

export const CLIENT_NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'dashboard',
    href: routes.client.dashboard,
    label: 'Кабінет',
    Icon: iconLibrary.home,
    startsWith: true,
  },
  {
    key: 'changePassword',
    href: routes.client.changePassword,
    label: 'Зміна пароля',
    Icon: iconLibrary.settings,
    startsWith: true,
  },
];

export const NAV_ITEMS_BY_SCOPE: Record<NavScope, readonly NavItem[]> = {
  public: PUBLIC_NAV_ITEMS,
  admin: ADMIN_NAV_ITEMS,
  client: CLIENT_NAV_ITEMS,
};

export const navCta = {
  href: routes.public.order,
  label: menuText.cta,
} as const;
