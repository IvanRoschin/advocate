import { FaEnvelope, FaMoneyBillWave } from 'react-icons/fa';
import { FiBookOpen, FiGrid, FiHome, FiUser } from 'react-icons/fi';
import { GrBusinessService } from 'react-icons/gr';

import { routes } from '@/app/config/routes';

import type { NavItem } from './nav.types';

// Direct react-icons imports, not `iconLibrary` from '@/resources' — that
// barrel combines every icon in the app (including admin/dashboard-only
// ones) into one object, so importing it here (always-loaded, every page)
// pulled all of them into the public bundle. Same fix as nav.ts itself.
const navIcons = {
  home: FiHome,
  about: FiUser,
  practices: FiGrid,
  services: GrBusinessService,
  blog: FiBookOpen,
  payments: FaMoneyBillWave,
  contact: FaEnvelope,
};

// Anonymous visitors only ever need this — split out from admin/client/manager
// so the public bundle (every homepage/marketing page) doesn't have to pull
// in signOut, admin routes, or client-portal nav data. See nav.private.ts.
export const PUBLIC_NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'home',
    href: routes.public.home,
    label: 'Головна',
    Icon: navIcons.home,
  },
  {
    key: 'about',
    href: routes.public.about,
    label: 'Про мене',
    Icon: navIcons.about,
  },
  {
    key: 'practices',
    href: routes.public.practices,
    label: 'Практики',
    Icon: navIcons.practices,
    startsWith: true,
  },
  {
    key: 'services',
    href: routes.public.services,
    label: 'Послуги',
    Icon: navIcons.services,
    startsWith: true,
  },
  {
    key: 'blog',
    href: routes.public.blog,
    label: 'Блог',
    Icon: navIcons.blog,
    startsWith: true,
  },
  {
    key: 'payments',
    href: routes.public.payments,
    label: 'Оплата',
    Icon: navIcons.payments,
    startsWith: true,
  },
  {
    key: 'contact',
    href: routes.public.contact,
    label: 'Контакти',
    Icon: navIcons.contact,
  },
];

export const PUBLIC_NAV_MOBILE_ITEMS: readonly NavItem[] = [
  {
    key: 'home',
    href: routes.public.home,
    label: 'Головна',
    Icon: navIcons.home,
  },
  {
    key: 'services',
    href: routes.public.services,
    label: 'Послуги',
    Icon: navIcons.services,
    startsWith: true,
  },
  {
    key: 'blog',
    href: routes.public.blog,
    label: 'Блог',
    Icon: navIcons.blog,
    startsWith: true,
  },
  {
    key: 'payments',
    href: routes.public.payments,
    label: 'Оплата',
    Icon: navIcons.payments,
    startsWith: true,
  },
  {
    key: 'contact',
    href: routes.public.contact,
    label: 'Контакти',
    Icon: navIcons.contact,
  },
];
