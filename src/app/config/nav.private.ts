import { signOut } from 'next-auth/react';

import { routes } from '@/app/config/routes';
import { useUserStore } from '@/app/store/user.store';
import { iconLibrary } from '@/resources';

import type { NavItem } from './nav.types';

// Admin/client/manager nav — only ever needed by authenticated staff/clients,
// never by an anonymous visitor. Loaded on demand via dynamic import from
// nav.shared.ts so the public bundle doesn't pay for signOut + admin routes
// + these icons on every page load. See nav.public.ts for the always-on set.

const handleSignOut = async () => {
  useUserStore.getState().clearUser();

  await signOut({
    callbackUrl: routes.public.home,
  });
};

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
    key: 'subscribers',
    href: routes.admin.crm.subscribers,
    label: 'Підписники',
    Icon: iconLibrary.email,
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
    onClick: handleSignOut,
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
    label: 'Відновити',
    Icon: iconLibrary.settings,
    startsWith: true,
  },
  {
    key: 'singout',
    label: 'Вихід',
    Icon: iconLibrary.arrowUpRightFromSquare,
    onClick: handleSignOut,
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
    onClick: handleSignOut,
  },
];
