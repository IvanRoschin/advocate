'use client';

import { useEffect, useMemo, useState } from 'react';

import { getUserScope } from '@/app/lib/auth/getUserScope';
import { cn } from '@/app/lib/utils';
import { useUserStore } from '@/app/store/user.store';
import { AppLink } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { isSelected, useNavLinkItems, useSelectedPathname } from './nav.shared';

import type { NavScope } from '@/app/config/nav';
type NavPillProps = {
  scope?: NavScope;
  showLabelsFrom?: 'md' | 'lg';
};

export const NavPill = ({ scope, showLabelsFrom = 'md' }: NavPillProps) => {
  const pathname = useSelectedPathname();
  const user = useUserStore(state => state.user);

  const resolvedScope = useMemo(
    () => scope ?? getUserScope(user?.role),
    [scope, user?.role]
  );

  const items = useNavLinkItems(resolvedScope);

  const [hash, setHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash);
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
          'flex items-center gap-1 overflow-x-auto whitespace-nowrap',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        )}
        aria-label="Навігація"
      >
        {items.map(item => {
          const selected = isSelected({
            pathname,
            hash,
            href: item.href,
            startsWith: item.startsWith,
          });

          return (
            <Tooltip key={item.key}>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};
