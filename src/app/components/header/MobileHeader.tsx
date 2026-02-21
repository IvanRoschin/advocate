'use client';

import { motion } from 'framer-motion';

import { NavPill } from './NavPill';
import { ThemeToggle } from './ThemeToggle';
import { TimeDisplay } from './TimeDisplay';

type MobileHeaderProps = {
  showTime?: boolean;
  timeZone?: string;
  showThemeToggle?: boolean;
};

export const MobileHeader = ({
  showTime = true,
  timeZone = 'Europe/Kyiv',
  showThemeToggle = true,
}: MobileHeaderProps) => {
  return (
    <>
      <div className="pointer-events-none fixed top-0 left-0 z-40 h-20 w-full bg-linear-to-b from-[rgba(0,0,0,0.06)] to-transparent" />
      <div className="pointer-events-none fixed bottom-0 left-0 z-40 h-20 w-full bg-linear-to-t from-[rgba(0,0,0,0.06)] to-transparent" />

      <header className="fixed bottom-0 left-0 z-50 w-full">
        <div className="mx-auto grid h-20 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-3">
          <div className="flex items-center">
            <div className="hidden text-sm text-neutral-600 md:block">
              {showTime ? <span className="opacity-80">{timeZone}</span> : null}
            </div>
          </div>

          <motion.div
            className="max-w-full justify-self-center"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex max-w-[calc(100vw-24px)] items-center gap-2 overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/80 px-2 py-1 shadow-lg backdrop-blur supports-backdrop-filter:bg-white/60">
              <NavPill />

              {showThemeToggle ? (
                <div className="ml-1 shrink-0 border-l border-neutral-200/70 pl-2">
                  <ThemeToggle />
                </div>
              ) : null}
            </div>
          </motion.div>

          <div className="flex justify-end">
            <div className="hidden text-sm text-neutral-700 md:block">
              {showTime ? <TimeDisplay timeZone={timeZone} /> : null}
            </div>
          </div>
        </div>
      </header>

      {/* <div className="h-20" /> */}
    </>
  );
};
