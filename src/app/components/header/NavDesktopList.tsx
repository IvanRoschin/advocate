'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { getUserScope } from '@/app/lib/auth/getUserScope';
import { cn } from '@/app/lib/utils';
import { useUserStore } from '@/app/store/user.store';
import { AppLink } from '@/components';
import { menuText } from '@/resources';

import { isSelected, useNavLinkItems } from './nav.shared';

import type { NavScope } from '@/app/config/nav';

type NavDesktopListProps = {
  scope?: NavScope;
  showLabelsFrom?: 'md' | 'lg' | 'xl' | '2xl';
};

export const NavDesktopList = ({
  scope,
  showLabelsFrom = 'xl',
}: NavDesktopListProps) => {
  const user = useUserStore(state => state.user);

  const resolvedScope = useMemo<NavScope>(() => {
    if (scope) return scope;
    return getUserScope(user?.role);
  }, [scope, user?.role]);

  const items = useNavLinkItems(resolvedScope);
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
          const active = isSelected({
            pathname,
            hash,
            href: item.href,
            startsWith: item.startsWith,
          });

          return (
            <li key={item.key} className="shrink-0">
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
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
