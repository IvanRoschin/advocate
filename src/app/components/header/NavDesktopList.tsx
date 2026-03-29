'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { NavScope } from '@/app/config/nav';
import { cn } from '@/app/lib/utils';
import { AppLink } from '@/components';
import { menuText } from '@/resources';

import { isSelected, useNavItems } from './nav.shared';

type NavDesktopListProps = {
  scope?: NavScope;
  showLabelsFrom?: 'md' | 'lg' | 'xl' | '2xl';
};

export const NavDesktopList = ({
  scope = 'public',
  showLabelsFrom = 'xl',
}: NavDesktopListProps) => {
  const items = useNavItems(scope);
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
        {items.map(({ key, href, label, startsWith, Icon }) => {
          const active = isSelected({
            pathname,
            hash,
            href,
            startsWith,
          });

          return (
            <li key={key} className="shrink-0">
              <AppLink
                href={href}
                aria-current={active ? 'page' : undefined}
                title={label}
                className={cn(
                  'desktop-nav-link flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm leading-none font-medium transition',
                  active
                    ? 'desktop-nav-link-active shadow-sm'
                    : 'desktop-nav-link-inactive'
                )}
              >
                <Icon className="shrink-0 text-base" aria-hidden />
                <span className={labelClass}>{label}</span>
              </AppLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
