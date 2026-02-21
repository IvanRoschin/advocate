'use client';

import { cn } from '@/lib/utils';

import { NavDesktopList } from './NavDesktopList';
import { ThemeToggle } from './ThemeToggle';

type DesktopControlRailProps = {
  showThemeToggle?: boolean;
  className?: string;
};

export const DesktopControlRail = ({
  showThemeToggle = true,
  className,
}: DesktopControlRailProps) => {
  return (
    <div
      className={cn(
        // общая капсула
        'flex h-12 items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white/70 px-2 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/60',
        className
      )}
    >
      <NavDesktopList />

      {showThemeToggle ? (
        <>
          <div className="h-7 w-px shrink-0 bg-neutral-200" />
          <div className="flex h-10 shrink-0 items-center">
            <ThemeToggle />
          </div>
        </>
      ) : null}
    </div>
  );
};
