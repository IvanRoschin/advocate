'use client';

import { NavScope } from '@/app/config/nav';
import { cn } from '@/lib/utils';

import { NavDesktopList } from './NavDesktopList';
import { ThemeToggle } from './ThemeToggle';

type DesktopControlRailProps = {
  scope?: NavScope;
  showThemeToggle?: boolean;
  className?: string;
};

export const DesktopControlRail = ({
  scope = 'public',
  showThemeToggle = true,
  className,
}: DesktopControlRailProps) => {
  return (
    <div
      className={cn(
        'desktop-control-rail flex h-12 items-center gap-3 rounded-2xl border px-2 shadow-sm backdrop-blur',
        'supports-[backdrop-filter]:desktop-control-rail-supported',
        className
      )}
    >
      <NavDesktopList scope={scope} />

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
