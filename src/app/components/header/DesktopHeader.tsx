'use client';

import { useEffect, useState } from 'react';

import { NavScope } from '@/app/config/nav';
import { routes } from '@/app/config/routes';
import { useThemeStore } from '@/app/store/theme.store';
import { Btn, Logo } from '@/components';
import { cn } from '@/lib/utils';

import { DesktopControlRail } from './DesktopControlRail';
import { TimeDisplay } from './TimeDisplay';

type DesktopHeaderProps = {
  scope?: NavScope;
  showTime?: boolean;
  timeZone?: string;
  showThemeToggle?: boolean;
  showCta?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
};

export const DesktopHeader = ({
  scope = 'public',
  showTime = false,
  timeZone = 'Europe/Kyiv',
  showThemeToggle = true,
  showCta = true,
  ctaHref = routes.public.order,
  ctaLabel = 'Запис на консультацію',
}: DesktopHeaderProps) => {
  const theme = useThemeStore(state => state.theme);
  const logoVariant = theme === 'dark' ? 'dark' : 'light';

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const threshold = 8;

    const update = () => {
      setScrolled(window.scrollY > threshold);
    };

    update();

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header
      className={cn(
        'desktop-header-shell sticky top-0 z-50 hidden w-full border-b backdrop-blur xl:block',
        'supports-[backdrop-filter]:desktop-header-shell-supported',
        scrolled && 'desktop-header-shell-scrolled shadow-sm',
        'transition-[box-shadow,border-color,background-color] duration-200 ease-out'
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Logo variant={logoVariant} />

          <div className="min-w-0">
            <DesktopControlRail
              scope={scope}
              showThemeToggle={showThemeToggle}
            />
          </div>
        </div>

        <div className="flex h-10 shrink-0 items-center gap-4">
          {showTime ? (
            <div className="text-desktop-header-time hidden text-sm md:flex md:h-10 md:items-center">
              <TimeDisplay timeZone={timeZone} />
            </div>
          ) : null}

          {showCta ? (
            <Btn
              label={ctaLabel}
              href={ctaHref}
              className="h-10 rounded-xl px-5 leading-none"
            />
          ) : null}
        </div>
      </div>
    </header>
  );
};
