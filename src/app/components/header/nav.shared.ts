'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { NAV_ITEMS_BY_SCOPE } from '@/app/config/nav';

import type { NavItem, NavScope } from '@/app/config/nav';

export type { NavScope };

type IsSelectedArgs = {
  pathname: string;
  hash: string;
  href?: string;
  startsWith?: boolean;
};

const getHrefHash = (href?: string) => {
  if (!href) return '';
  const index = href.indexOf('#');
  return index >= 0 ? href.slice(index) : '';
};

const isHashLink = (href?: string) => href?.startsWith('/#') ?? false;

export const isNavItemLink = (
  item: NavItem
): item is Extract<NavItem, { href: string }> =>
  'href' in item && typeof item.href === 'string' && item.href.length > 0;

export function useNavItems(scope: NavScope) {
  return useMemo(
    () => NAV_ITEMS_BY_SCOPE[scope].filter(item => item.enabled !== false),
    [scope]
  );
}

export function useNavLinkItems(scope: NavScope) {
  const items = useNavItems(scope);

  return useMemo(() => items.filter(isNavItemLink), [items]);
}

export function useSelectedPathname() {
  return usePathname() ?? '';
}

export const isSelected = ({
  pathname,
  hash,
  href,
  startsWith = false,
}: IsSelectedArgs) => {
  if (!href) return false;

  if (href === '/') {
    return pathname === '/' && !hash;
  }

  if (isHashLink(href)) {
    return pathname === '/' && hash === getHrefHash(href);
  }

  if (startsWith) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href;
};
