'use client';

import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { routes } from '@/app/config/routes';
import { getUserScope } from '@/app/lib/auth/getUserScope';
import { cn } from '@/app/lib/utils';
import { useUserStore } from '@/app/store/user.store';
import { AppLink } from '@/components';
import { iconLibrary, menuText } from '@/resources';

import { isSelected, useNavLinkItems } from './nav.shared';

import type { NavScope } from '@/app/config/nav';
import type { HeaderPublicAuthState } from './HeaderClient';

type NavDesktopListProps = {
  scope?: NavScope;
  showLabelsFrom?: 'md' | 'lg' | 'xl' | '2xl';
  publicAuth?: HeaderPublicAuthState;
};

export const NavDesktopList = ({
  scope,
  showLabelsFrom = 'xl',
  publicAuth,
}: NavDesktopListProps) => {
  const user = useUserStore(state => state.user);

  const resolvedScope = useMemo<NavScope>(() => {
    if (scope) return scope;
    return getUserScope(user?.role);
  }, [scope, user?.role]);

  const baseItems = useNavLinkItems(resolvedScope);

  const items = useMemo(() => {
    if (resolvedScope !== 'public') {
      return baseItems;
    }

    const publicItems = baseItems.filter(item => item.key !== 'dashboard');

    if (!publicAuth?.isAuthenticated) {
      return [
        ...publicItems,
        {
          key: 'signin',
          href: routes.public.auth.signIn,
          label: 'Кабінет',
          Icon: iconLibrary.person,
        },
      ];
    }

    return [
      ...publicItems,
      {
        key: 'signout',
        label: 'Вихід',
        Icon: iconLibrary.arrowUpRightFromSquare,
        onClick: async () => {
          useUserStore.getState().clearUser();

          await signOut({
            callbackUrl: routes.public.home,
          });
        },
      },
    ];
  }, [baseItems, publicAuth, resolvedScope]);

  const pathname = usePathname() ?? '';
  const [hash, setHash] = useState('');

  useEffect(() => {
    const syncHash = () => {
      setHash(window.location.hash || '');
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => {
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);

  const labelClassMap: Record<
    NonNullable<NavDesktopListProps['showLabelsFrom']>,
    string
  > = {
    md: 'hidden md:inline',
    lg: 'hidden lg:inline',
    xl: 'hidden xl:inline',
    '2xl': 'hidden 2xl:inline',
  };

  const labelClass = labelClassMap[showLabelsFrom];

  return (
    <nav className="font-eukrainehead min-w-0" aria-label={menuText.navAria}>
      <ul className="flex h-10 min-w-0 items-center gap-1 whitespace-nowrap">
        {items.map(item => {
          const active =
            'href' in item
              ? isSelected({
                  pathname,
                  hash,
                  href: item.href,
                  startsWith: item.startsWith,
                })
              : false;

          return (
            <li key={item.key} className="shrink-0">
              {'href' in item ? (
                <AppLink
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  title={item.label}
                  className={cn(
                    'desktop-nav-link flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm leading-none font-medium transition',
                    active
                      ? 'desktop-nav-link-active shadow-sm'
                      : 'desktop-nav-link-inactive'
                  )}
                >
                  <item.Icon className="shrink-0 text-base" aria-hidden />
                  <span className={labelClass}>{item.label}</span>
                </AppLink>
              ) : (
                <button
                  type="button"
                  title={item.label}
                  onClick={item.onClick}
                  className={cn(
                    'desktop-nav-link desktop-nav-link-inactive flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm leading-none font-medium transition'
                  )}
                >
                  <item.Icon className="shrink-0 text-base" aria-hidden />
                  <span className={labelClass}>{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
