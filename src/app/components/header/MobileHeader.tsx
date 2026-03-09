'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { IoIosArrowUp } from 'react-icons/io';

import { useScrollToTopVisibility } from '@/app/hooks/useScrollToTopVisibility';

import { NavPill } from './NavPill';
import { ThemeToggle } from './ThemeToggle';
import { TimeDisplay } from './TimeDisplay';

type MobileHeaderProps = {
  showTime?: boolean;
  timeZone?: string;
  showThemeToggle?: boolean;
  scrollTopThreshold?: number;
};

export const MobileHeader = ({
  showTime = true,
  timeZone = 'Europe/Kyiv',
  showThemeToggle = true,
  scrollTopThreshold = 300,
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
      <div className="mobile-header-fade-top pointer-events-none fixed top-0 left-0 z-40 h-20 w-full md:hidden" />
      <div className="mobile-header-fade-bottom pointer-events-none fixed bottom-0 left-0 z-40 h-20 w-full md:hidden" />

      <header className="fixed bottom-0 left-0 z-50 w-full md:hidden">
        <div className="mx-auto grid h-20 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-3">
          <div className="flex items-center">
            <div className="text-mobile-header-time hidden text-sm md:block">
              {showTime ? <span className="opacity-80">{timeZone}</span> : null}
            </div>
          </div>

          <motion.div
            className="max-w-full justify-self-center"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mobile-header-shell supports-backdrop-filter:mobile-header-shell-supported flex max-w-[calc(100vw-24px)] items-center gap-2 overflow-hidden rounded-2xl border px-2 py-1 shadow-lg backdrop-blur">
              <NavPill />

              <AnimatePresence initial={false}>
                {showScrollTop ? (
                  <motion.div
                    key="scroll-top"
                    initial={{ width: 0, opacity: 0, scale: 0.92 }}
                    animate={{ width: 'auto', opacity: 1, scale: 1 }}
                    exit={{ width: 0, opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 overflow-hidden"
                  >
                    <div className="border-mobile-header-divider border-l pl-2">
                      <button
                        type="button"
                        onClick={handleScrollToTop}
                        aria-label="Повернутися нагору"
                        className="text-mobile-header-action hover:bg-mobile-header-action-hover inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors focus:ring-2 focus:outline-none"
                        style={{
                          ['--tw-ring-color' as string]:
                            'var(--mobile-header-ring)',
                        }}
                      >
                        <IoIosArrowUp size={20} />
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {showThemeToggle ? (
                <div className="border-mobile-header-divider ml-1 shrink-0 border-l pl-2">
                  <ThemeToggle />
                </div>
              ) : null}
            </div>
          </motion.div>

          <div className="flex justify-end">
            <div className="text-mobile-header-time hidden text-sm md:block">
              {showTime ? <TimeDisplay timeZone={timeZone} /> : null}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
