'use client';

import { IoIosArrowUp } from 'react-icons/io';

import { useScrollToTopVisibility } from '@/app/hooks/useScrollToTopVisibility';

import { HeaderPublicAuthState } from './HeaderClient';
import { NavPill } from './NavPill';
import { ThemeToggle } from './ThemeToggle';
import { TimeDisplay } from './TimeDisplay';

import type { NavScope } from './nav.shared';
type MobileHeaderProps = {
  scope?: NavScope;
  showTime?: boolean;
  timeZone?: string;
  showThemeToggle?: boolean;
  scrollTopThreshold?: number;
  publicAuth?: HeaderPublicAuthState;
};

export const MobileHeader = ({
  scope = 'public',
  showTime = false,
  timeZone = 'Europe/Kyiv',
  showThemeToggle = true,
  scrollTopThreshold = 300,
  publicAuth,
}: MobileHeaderProps) => {
  const showScrollTop = useScrollToTopVisibility(scrollTopThreshold);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div className="mobile-header-fade-top pointer-events-none fixed top-0 left-0 z-40 h-20 w-full xl:hidden" />
      <div className="mobile-header-fade-bottom pointer-events-none fixed bottom-0 left-0 z-40 h-20 w-full xl:hidden" />

      <header className="fixed bottom-0 left-0 z-50 w-full xl:hidden">
        <div className="relative mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-3">
          <div className="min-w-18 shrink-0">
            {showTime ? (
              <div className="text-mobile-header-time text-xs leading-none sm:text-sm">
                <TimeDisplay timeZone={timeZone} />
              </div>
            ) : null}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-2 absolute left-1/2 w-full max-w-[min(calc(100vw-24px),32rem)] -translate-x-1/2 px-3 duration-200">
            <div className="mobile-header-shell supports-[backdrop-filter]:mobile-header-shell-supported flex w-full min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-1.5 py-1 shadow-lg backdrop-blur">
              <div className="min-w-0 flex-1 overflow-hidden">
                <NavPill scope={scope} publicAuth={publicAuth} />
              </div>

              {showScrollTop ? (
                <div className="animate-in fade-in zoom-in-90 shrink-0 overflow-hidden duration-200">
                  <div className="border-mobile-header-divider border-l pl-1.5">
                    <button
                      type="button"
                      onClick={handleScrollToTop}
                      aria-label="Повернутися нагору"
                      className="mobile-header-action-btn inline-flex h-8 w-8 items-center justify-center rounded-xl transition-[color,background-color,transform] duration-150 hover:scale-[1.03] focus:outline-none active:scale-90"
                    >
                      <IoIosArrowUp size={16} />
                    </button>
                  </div>
                </div>
              ) : null}

              {showThemeToggle ? (
                <div className="border-mobile-header-divider ml-0.5 shrink-0 border-l pl-1.5">
                  <ThemeToggle />
                </div>
              ) : null}
            </div>
          </div>

          <div className="min-w-18 shrink-0" />
        </div>
      </header>
    </>
  );
};
