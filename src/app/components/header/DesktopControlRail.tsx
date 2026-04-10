'use client';

import { NavScope } from '@/app/config/nav';
import { cn } from '@/app/lib/utils';

import { NavDesktopList } from './NavDesktopList';
import { ThemeToggle } from './ThemeToggle';

import type { HeaderPublicAuthState } from './HeaderClient';

type DesktopControlRailProps = {
  scope?: NavScope;
  showThemeToggle?: boolean;
  className?: string;
  publicAuth?: HeaderPublicAuthState;
};

export const DesktopControlRail = ({
  scope = 'public',
  showThemeToggle = true,
  className,
  publicAuth,
}: DesktopControlRailProps) => {
  return (
    <div
      className={cn(
        'desktop-control-rail flex h-12 min-w-0 items-center gap-2 rounded-2xl border px-2 shadow-sm backdrop-blur',
        'supports-[backdrop-filter]:desktop-control-rail-supported',
        className
      )}
    >
      <div className="scrollbar-none min-w-0 flex-1 overflow-x-auto">
        <NavDesktopList
          scope={scope}
          showLabelsFrom="xl"
          publicAuth={publicAuth}
        />
      </div>

      {showThemeToggle ? (
        <>
          <div className="desktop-control-rail-divider h-7 w-px shrink-0" />
          <div className="flex h-10 shrink-0 items-center">
            <ThemeToggle />
          </div>
        </>
      ) : null}
    </div>
  );
};
