'use client';

import { useEffect, useState } from 'react';

import { routes } from '@/app/config/routes';
import { Btn, Logo } from '@/components';
import { cn } from '@/lib/utils';

import { DesktopControlRail } from './DesktopControlRail';
import { TimeDisplay } from './TimeDisplay';

type DesktopHeaderProps = {
  showTime?: boolean;
  timeZone?: string;
  showThemeToggle?: boolean;
};

export const DesktopHeader = ({
  showTime = false,
  timeZone = 'Europe/Kyiv',
  showThemeToggle = true,
}: DesktopHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const threshold = 8;

    const update = () => {
      setScrolled(window.scrollY > threshold);
    };

    update(); // выставим корректное значение уже после mount

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 hidden w-full border-b border-neutral-200/70 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60 xl:block',
        scrolled && 'border-neutral-200/90 shadow-sm',
        'transition-[box-shadow,border-color] duration-200 ease-out'
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-6">
          <Logo variant="light" />

          <div className="min-w-0">
            <DesktopControlRail showThemeToggle={showThemeToggle} />
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex h-10 shrink-0 items-center gap-4">
          {showTime ? (
            <div className="hidden text-sm text-neutral-700 md:flex md:h-10 md:items-center">
              <TimeDisplay timeZone={timeZone} />
            </div>
          ) : null}

          <Btn
            label="Запис на консультацію"
            href={routes.public.order}
            className="h-10 rounded-xl px-5 leading-none"
          />
        </div>
      </div>
    </header>
  );
};
