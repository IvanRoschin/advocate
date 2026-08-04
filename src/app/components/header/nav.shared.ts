'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { PUBLIC_NAV_ITEMS, PUBLIC_NAV_MOBILE_ITEMS } from '@/app/config/nav.public';

import type { NavItem, NavScope } from '@/app/config/nav.types';

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

const isNavItemLink = (
  item: NavItem
): item is Extract<NavItem, { href: string }> =>
  'href' in item && typeof item.href === 'string' && item.href.length > 0;

const PUBLIC_ITEMS_BY_SCOPE = {
  public: PUBLIC_NAV_ITEMS,
  mobile: PUBLIC_NAV_MOBILE_ITEMS,
} as const;

const isPublicScope = (
  scope: NavScope
): scope is keyof typeof PUBLIC_ITEMS_BY_SCOPE =>
  scope === 'public' || scope === 'mobile';

// admin/client/manager nav items are dynamically imported (see
// nav.private.ts) — an anonymous visitor on a public page should never have
// to download signOut + admin routes + their icons just because this hook
// exists. Public/mobile scopes resolve synchronously, no loading gap.
export function useNavItems(scope: NavScope) {
  const [privateItems, setPrivateItems] = useState<readonly NavItem[] | null>(
    null
  );

  useEffect(() => {
    if (isPublicScope(scope)) return;

    let cancelled = false;

    import('@/app/config/nav.private').then(mod => {
      if (cancelled) return;

      const itemsByScope = {
        admin: mod.ADMIN_NAV_ITEMS,
        client: mod.CLIENT_NAV_ITEMS,
        manager: mod.MANAGER_NAV_ITEMS,
      } as const;

      setPrivateItems(itemsByScope[scope]);
    });

    return () => {
      cancelled = true;
    };
  }, [scope]);

  return useMemo(() => {
    const items = isPublicScope(scope)
      ? PUBLIC_ITEMS_BY_SCOPE[scope]
      : (privateItems ?? []);

    return items.filter(item => item.enabled !== false);
  }, [scope, privateItems]);
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
