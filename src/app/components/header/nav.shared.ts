'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { NAV_ITEMS } from '@/app/config/nav';

export function useNavItems() {
  return useMemo(() => NAV_ITEMS.filter(i => i.enabled !== false), []);
}

export function useSelectedPathname() {
  return usePathname() ?? '';
}

export function isSelected(
  pathname: string,
  href: string,
  startsWith: boolean
) {
  if (href === '/') return pathname === '/';
  return startsWith ? pathname.startsWith(href) : pathname === href;
}
