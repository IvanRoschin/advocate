'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { NavScope } from '@/app/config/nav';
import { AppLink } from '@/components';
import { cn } from '@/lib/utils';
import { menuText } from '@/resources';

import { isSelected, useNavItems } from './nav.shared';

type NavDesktopListProps = {
  scope?: NavScope;
  showLabelsFrom?: 'md' | 'lg';
};

export const NavDesktopList = ({
  scope = 'public',
  showLabelsFrom = 'md',
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

  const labelClass =
    showLabelsFrom === 'lg' ? 'hidden lg:inline' : 'hidden md:inline';

  return (
    <nav className="font-eukrainehead" aria-label={menuText.navAria}>
      <ul className="flex h-10 items-center gap-1">
        {items.map(({ key, href, label, startsWith, Icon }) => {
          const active = isSelected({
            pathname,
            hash,
            href,
            startsWith,
          });

          return (
            <li key={key}>
              <AppLink
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'desktop-nav-link flex h-9 items-center gap-2 rounded-xl px-3 text-sm leading-none font-medium transition',
                  active
                    ? 'desktop-nav-link-active shadow-sm'
                    : 'desktop-nav-link-inactive'
                )}
              >
                <Icon className="text-[18px]" aria-hidden />
                <span className={labelClass}>{label}</span>
              </AppLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
