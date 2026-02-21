import type { IconType } from 'react-icons';

import { getRouteUrl, PublicStringRouteKey } from '@/app/config/routes';
import { iconLibrary, mainMenu, menuText } from '@/resources';

export type MenuRouteKey = (typeof mainMenu)[number]['route'];

export type NavItem = {
  route: MenuRouteKey;
  href: string;
  label: string;
  Icon: IconType;
  startsWith: boolean;
  enabled: boolean;
};

const ICON_BY_ROUTE: Record<MenuRouteKey, IconType> = {
  home: iconLibrary.home,
  about: iconLibrary.about,
  practices: iconLibrary.practices,
  blog: iconLibrary.blog,
  payments: iconLibrary.payments,
  contact: iconLibrary.contact,
};

const STARTS_WITH_BY_ROUTE: Partial<Record<MenuRouteKey, true>> = {
  practices: true,
  blog: true,
};

export const NAV_ITEMS: readonly NavItem[] = mainMenu.map(item => ({
  route: item.route,
  href: getRouteUrl(item.route),
  label: item.title,
  Icon: ICON_BY_ROUTE[item.route],
  startsWith: STARTS_WITH_BY_ROUTE[item.route] ?? false,
  enabled: true,
}));

export const navCta = {
  href: getRouteUrl(menuText.ctaRoute as PublicStringRouteKey),
  label: menuText.cta,
} as const;
