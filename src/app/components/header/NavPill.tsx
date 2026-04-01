'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/app/lib/utils';
import { AppLink } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { isSelected, useNavItems, useSelectedPathname } from './nav.shared';

import type { NavScope } from '@/app/config/nav';

type NavPillProps = {
  scope?: NavScope;
  showLabelsFrom?: 'md' | 'lg';
};

export const NavPill = ({
  scope = 'public',
  showLabelsFrom = 'md',
}: NavPillProps) => {
  const pathname = useSelectedPathname();
  const items = useNavItems(scope);

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
        {items.map(({ href, label, Icon, startsWith }) => {
          const selected = isSelected({
            pathname,
            hash,
            href,
            startsWith,
          });

          return (
            <Tooltip key={href}>
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
                  <AppLink href={href} aria-label={label}>
                    <span className="flex items-center gap-2">
                      <Icon className="text-[18px]" aria-hidden />
                      <span className={labelClass}>{label}</span>
                    </span>
                  </AppLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};
