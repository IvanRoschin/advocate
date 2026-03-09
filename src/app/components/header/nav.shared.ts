'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { NAV_ITEMS } from '@/app/config/nav';

type IsSelectedArgs = {
  pathname: string;
  hash: string;
  href: string;
  startsWith?: boolean;
};

const getHrefHash = (href?: string) => {
  if (!href) return '';
  const index = href.indexOf('#');
  return index >= 0 ? href.slice(index) : '';
};

const isHashLink = (href?: string) => href?.startsWith('/#') ?? false;

export function useNavItems() {
  return useMemo(() => NAV_ITEMS.filter(i => i.enabled !== false), []);
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
    return pathname.startsWith(href);
  }

  return pathname === href;
};
