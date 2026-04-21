'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

import { routes } from '@/app/config/routes';
import { getUserScope } from '@/app/lib/auth/getUserScope';
import { cn } from '@/app/lib/utils';
import { iconLibrary } from '@/app/resources';
import { useUserStore } from '@/app/store/user.store';
import { AppLink } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { HeaderPublicAuthState } from './HeaderClient';
import { isSelected, useNavLinkItems, useSelectedPathname } from './nav.shared';

import type { NavScope } from '@/app/config/nav';
type NavPillProps = {
  scope?: NavScope;
  showLabelsFrom?: 'md' | 'lg';
  publicAuth?: HeaderPublicAuthState;
};

const resolveDashboardHref = (role?: string): string => {
  const normalizedRole = typeof role === 'string' ? role.toUpperCase() : '';

  if (normalizedRole === 'ADMIN' || normalizedRole === 'MANAGER') {
    return routes.admin.dashboard;
  }

  if (normalizedRole === 'CLIENT') {
    return routes.client.dashboard;
  }

  return routes.public.auth.signIn;
};

export const NavPill = ({
  scope,
  showLabelsFrom = 'md',
  publicAuth,
}: NavPillProps) => {
  const pathname = useSelectedPathname();
  const user = useUserStore(state => state.user);

  const resolvedScope = useMemo<NavScope>(
    () => scope ?? getUserScope(user?.role),
    [scope, user?.role]
  );

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
          label: 'Увійти',
          Icon: iconLibrary.person,
        },
      ];
    }

    return [
      ...publicItems,
      {
        key: 'dashboard',
        href: resolveDashboardHref(publicAuth.role),
        label: 'Кабінет',
        Icon: iconLibrary.person,
      },
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

  const [hash, setHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash || '');
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);

    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  const labelClass =
    showLabelsFrom === 'lg'
      ? 'hidden text-sm lg:inline'
      : 'hidden text-sm md:inline';

  return (
    <TooltipProvider>
      <nav
        className={cn(
          'flex items-center justify-between overflow-x-auto whitespace-nowrap',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        )}
        aria-label="Навігація"
      >
        {items.map(item => {
          const selected =
            'href' in item
              ? isSelected({
                  pathname,
                  hash,
                  href: item.href,
                  startsWith: item.startsWith,
                })
              : false;

          return (
            <Tooltip key={item.key}>
              <TooltipTrigger asChild>
                {'href' in item ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'mobile-nav-pill h-9 shrink-0 rounded-xl px-2',
                      selected
                        ? 'mobile-nav-pill-active'
                        : 'mobile-nav-pill-inactive'
                    )}
                    asChild
                  >
                    <AppLink href={item.href} aria-label={item.label}>
                      <span className="flex items-center gap-2">
                        <item.Icon className="text-[18px]" aria-hidden />
                        <span className={labelClass}>{item.label}</span>
                      </span>
                    </AppLink>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mobile-nav-pill mobile-nav-pill-inactive h-9 shrink-0 rounded-xl px-2"
                    onClick={item.onClick}
                    aria-label={item.label}
                  >
                    <span className="flex items-center gap-2">
                      <item.Icon className="text-[18px]" aria-hidden />
                      <span className={labelClass}>{item.label}</span>
                    </span>
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};
