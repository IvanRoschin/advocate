'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { IoIosArrowUp } from 'react-icons/io';

import { useScrollToTopVisibility } from '@/app/hooks/useScrollToTopVisibility';

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
};

export const MobileHeader = ({
  scope = 'public',
  showTime = false,
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

          <motion.div
            className="absolute left-1/2 w-full max-w-[min(calc(100vw-24px),32rem)] -translate-x-1/2 px-3"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mobile-header-shell supports-[backdrop-filter]:mobile-header-shell-supported flex w-full min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-1.5 py-1 shadow-lg backdrop-blur">
              <div className="min-w-0 flex-1 overflow-hidden">
                <NavPill scope={scope} />
              </div>

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
                    <div className="border-mobile-header-divider border-l pl-1.5">
                      <motion.button
                        type="button"
                        onClick={handleScrollToTop}
                        aria-label="Повернутися нагору"
                        className="mobile-header-action-btn inline-flex h-8 w-8 items-center justify-center rounded-xl transition-colors focus:outline-none"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.03 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 28,
                          mass: 0.6,
                        }}
                      >
                        <motion.span
                          initial={false}
                          whileTap={{ y: -1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 700,
                            damping: 22,
                          }}
                        >
                          <IoIosArrowUp size={16} />
                        </motion.span>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {showThemeToggle ? (
                <div className="border-mobile-header-divider ml-0.5 shrink-0 border-l pl-1.5">
                  <ThemeToggle />
                </div>
              ) : null}
            </div>
          </motion.div>

          <div className="min-w-18 shrink-0" />
        </div>
      </header>
    </>
  );
};
