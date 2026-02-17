'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navItems } from '@/app/config/nav';
import { IconButton, Paper, Tooltip } from '@mui/material';

import { ThemeToggle } from './ThemeToggle';
import { TimeDisplay } from './TimeDisplay';

function isSelected(pathname: string, href: string, startsWith?: boolean) {
  if (href === '/') return pathname === '/';
  return startsWith ? pathname.startsWith(href) : pathname === href;
}

type HeaderProps = {
  showTime?: boolean;
  timeZone?: string;
  showThemeToggle?: boolean;
};

export const Header2 = ({
  showTime = true,
  timeZone = 'Europe/Kyiv',
  showThemeToggle = true,
}: HeaderProps) => {
  const pathname = usePathname() ?? '';

  return (
    <>
      {/* “Fade” эффект как в примере — имитируем легким градиентом */}
      <div className="pointer-events-none fixed top-0 left-0 z-40 h-20 w-full bg-linear-to-b from-[rgba(0,0,0,0.06)] to-transparent" />
      <div className="pointer-events-none fixed bottom-0 left-0 z-40 h-20 w-full bg-linear-to-t from-[rgba(0,0,0,0.06)] to-transparent" />

      <header className="fixed top-0 left-0 z-50 w-full">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-3">
          {/* left */}
          <div className="hidden min-w-35 items-center text-sm text-neutral-600 md:flex">
            {/* можешь сюда поставить что угодно: телефон, слоган, город */}
            {showTime ? <span className="opacity-80">{timeZone}</span> : null}
          </div>

          {/* center nav */}
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <Paper
              elevation={6}
              className="flex items-center gap-2 rounded-2xl border border-neutral-200/60 bg-white/80 px-2 py-1 backdrop-blur supports-backdrop-filter:bg-white/60"
            >
              <nav className="flex items-center gap-1">
                {navItems
                  .filter(i => i.enabled !== false)
                  .map(({ href, label, Icon, startsWith }) => {
                    const selected = isSelected(pathname, href, startsWith);

                    return (
                      <Tooltip key={href} title={label}>
                        <IconButton
                          component={Link}
                          href={href}
                          aria-label={label}
                          size="small"
                          className={[
                            'rounded-xl',
                            selected
                              ? 'bg-neutral-900 text-white'
                              : 'text-neutral-700',
                          ].join(' ')}
                        >
                          <span className="flex items-center gap-2 px-1.5">
                            <Icon className="text-[18px]" />
                            {/* На md+ показываем подписи, на мобилке только иконки */}
                            <span className="hidden text-sm md:inline">
                              {label}
                            </span>
                          </span>
                        </IconButton>
                      </Tooltip>
                    );
                  })}
              </nav>

              {showThemeToggle ? (
                <div className="ml-1 border-l border-neutral-200/70 pl-2">
                  <ThemeToggle />
                </div>
              ) : null}
            </Paper>
          </motion.div>

          {/* right */}
          <div className="min-w-35 text-right text-sm text-neutral-700">
            {showTime ? <TimeDisplay timeZone={timeZone} /> : null}
          </div>
        </div>
      </header>

      {/* отступ, чтобы контент не уезжал под fixed-header */}
      <div className="h-20" />
    </>
  );
};
