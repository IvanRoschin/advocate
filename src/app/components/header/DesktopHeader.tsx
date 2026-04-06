'use client';

import { useEffect, useState } from 'react';

import { NavScope } from '@/app/config/nav';
import { routes } from '@/app/config/routes';
import { cn } from '@/app/lib/utils';
import { useThemeStore } from '@/app/store/theme.store';
import { Btn, Logo } from '@/components';

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
      <div className="mx-auto grid h-20 w-full max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 2xl:px-6">
        <div className="shrink-0">
          <Logo variant={logoVariant} />
        </div>

        <div className="min-w-0">
          <DesktopControlRail
            scope={scope}
            showThemeToggle={showThemeToggle}
            className="max-w-full min-w-0"
          />
        </div>

        <div className="flex h-10 shrink-0 items-center gap-3">
          {showTime ? (
            <div className="text-desktop-header-time flex h-10 items-center text-sm">
              <TimeDisplay timeZone={timeZone} />
            </div>
          ) : null}
          {showCta ? (
            <Btn href={ctaHref} className="h-10 rounded-xl px-4 leading-none">
              <span className="hidden 2xl:inline">{ctaLabel}</span>
              <span className="xl:inline 2xl:hidden">Консультація</span>
            </Btn>
          ) : null}
        </div>
      </div>
    </header>
  );
};
