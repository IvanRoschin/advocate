'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppLink } from '@/components';
import { cn } from '@/lib/utils';
import { menuText } from '@/resources';

import { isSelected, useNavItems } from './nav.shared';

export const NavDesktopList = () => {
  const items = useNavItems();
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

  return (
    <nav className="font-eukrainehead" aria-label={menuText.navAria}>
      <ul className="flex h-10 items-center gap-1">
        {items.map(({ route, href, label, startsWith }) => {
          const active = isSelected({
            pathname,
            hash,
            href,
            startsWith,
          });

          return (
            <li key={route}>
              <AppLink
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-9 items-center rounded-xl px-3 text-sm leading-none font-medium transition',
                  active
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:bg-neutral-100'
                )}
              >
                {label}
              </AppLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
