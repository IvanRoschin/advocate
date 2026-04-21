import { signOut } from 'next-auth/react';

import { routes } from '@/app/config/routes';
import { useUserStore } from '@/app/store/user.store';
import { iconLibrary, menuText } from '@/resources';

import type { IconType } from 'react-icons';

export type NavScope = 'public' | 'admin' | 'client' | 'manager' | 'mobile';

type BaseNavItem = {
  key: string;
  label: string;
  Icon: IconType;
  startsWith?: boolean;
  enabled?: boolean;
};

export type NavItemLink = BaseNavItem & {
  href: string;
  onClick?: never;
};

export type NavItemAction = BaseNavItem & {
  href?: never;
  onClick: () => void | Promise<void>;
};

export type NavItem = NavItemLink | NavItemAction;

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
    key: 'clients',
    href: routes.admin.crm.clients,
    label: 'Клієнти',
    Icon: iconLibrary.clients,
    startsWith: true,
  },
  {
    key: 'reviews',
    href: routes.admin.ui.reviews,
    label: 'Відгуки',
    Icon: iconLibrary.reviews,
    startsWith: true,
  },
  {
    key: 'slides',
    href: routes.admin.ui.slides,
    label: 'Слайди',
    Icon: iconLibrary.gallery,
    startsWith: true,
  },
  {
    key: 'pageSettings',
    href: routes.admin.ui.pageSettings,
    label: 'Налаштування сторінок',
    Icon: iconLibrary.settings,
    startsWith: true,
  },
  {
    key: 'singout',
    label: 'Вихід',
    Icon: iconLibrary.arrowUpRightFromSquare,
    onClick: async () => {
      useUserStore.getState().clearUser();

      await signOut({
        callbackUrl: routes.public.auth.signIn,
      });
    },
  },
];

export const CLIENT_NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'cases',
    href: routes.client.cases,
    label: 'Мої справи',
    Icon: iconLibrary.briefcaseBusiness,
    startsWith: true,
  },
  {
    key: 'documents',
    href: routes.client.documents,
    label: 'Документи',
    Icon: iconLibrary.document,
    startsWith: true,
  },
  {
    key: 'messages',
    href: routes.client.messages,
    label: 'Повідомлення',
    Icon: iconLibrary.envelope,
    startsWith: true,
  },
  {
    key: 'profile',
    href: routes.client.profile,
    label: 'Профіль',
    Icon: iconLibrary.user,
    startsWith: true,
  },
  {
    key: 'access',
    href: routes.client.access,
    label: 'Доступ',
    Icon: iconLibrary.people,
    startsWith: true,
  },
  {
    key: 'changePassword',
    href: routes.client.settings.changePassword,
    label: 'Змінити пароль',
    Icon: iconLibrary.settings,
    startsWith: true,
  },
  {
    key: 'repairClient',
    href: routes.client.settings.repairClientAccess,
    label: 'Відновити клієнта',
    Icon: iconLibrary.settings,
    startsWith: true,
  },
  {
    key: 'singout',
    label: 'Вихід',
    Icon: iconLibrary.arrowUpRightFromSquare,
    onClick: async () => {
      useUserStore.getState().clearUser();

      await signOut({
        callbackUrl: routes.public.auth.signIn,
      });
    },
  },
];

export const MANAGER_NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'dashboard',
    href: routes.admin.dashboard,
    label: 'Головна',
    Icon: iconLibrary.home,
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
    key: 'reviews',
    href: routes.admin.ui.reviews,
    label: 'Відгуки',
    Icon: iconLibrary.reviews,
    startsWith: true,
  },
  {
    key: 'slides',
    href: routes.admin.ui.slides,
    label: 'Слайди',
    Icon: iconLibrary.gallery,
    startsWith: true,
  },
  {
    key: 'singout',
    label: 'Вихід',
    Icon: iconLibrary.arrowUpRightFromSquare,
    onClick: async () => {
      useUserStore.getState().clearUser();

      await signOut({
        callbackUrl: routes.public.auth.signIn,
      });
    },
  },
];

export const NAV_ITEMS_BY_SCOPE: Record<NavScope, readonly NavItem[]> = {
  public: PUBLIC_NAV_ITEMS,
  admin: ADMIN_NAV_ITEMS,
  client: CLIENT_NAV_ITEMS,
  manager: MANAGER_NAV_ITEMS,
  mobile: PUBLIC_NAV_MOBILE_ITEMS,
};

export const navCta = {
  href: routes.public.offer,
  label: menuText.cta,
} as const;
