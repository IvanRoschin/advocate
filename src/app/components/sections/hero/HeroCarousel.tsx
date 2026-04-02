'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { SlideResponseDTO } from '@/app/types';
import { NextImage } from '@/components';
import { cn } from '@/lib';

// export type CarouselItem = {
//   src: string;
//   alt: string;
// };

type HeroCarouselProps = {
  items: SlideResponseDTO[];
  autoplay?: boolean;
  intervalMs?: number;
  initialIndex?: number;
  className?: string;
  showArrows?: boolean;
  showBars?: boolean;
  pauseOnHover?: boolean;
  debugBarsTopRight?: boolean;
};

export function HeroCarousel({
  items,
  autoplay = true,
  intervalMs = 6000,
  initialIndex = 0,
  className,
  showArrows = true,
  showBars = true,
  pauseOnHover = true,
}: HeroCarouselProps) {
  const safeItems = React.useMemo(() => (items ?? []).filter(Boolean), [items]);
  const count = safeItems.length;

  const [index, setIndex] = React.useState(() => {
    if (!count) return 0;
    return Math.max(0, Math.min(initialIndex, count - 1));
  });

  React.useEffect(() => {
    if (!count) return;
    setIndex(i => Math.max(0, Math.min(i, count - 1)));
  }, [count]);

  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [paused, setPaused] = React.useState(false);

  const go = React.useCallback(
    (nextIdx: number, dir: 1 | -1) => {
      if (count <= 1) return;
      setDirection(dir);
      const normalized = ((nextIdx % count) + count) % count;
      setIndex(normalized);
    },
    [count]
  );

  const next = React.useCallback(() => go(index + 1, 1), [go, index]);
  const prev = React.useCallback(() => go(index - 1, -1), [go, index]);

  React.useEffect(() => {
    if (count <= 1) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, next, prev]);

  React.useEffect(() => {
    if (!autoplay || count <= 1 || paused) return;

    const id = window.setInterval(() => {
      setDirection(1);
      setIndex(i => (i + 1) % count);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [autoplay, count, intervalMs, paused]);

  const pauseHandlers = pauseOnHover
    ? {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
        onFocusCapture: () => setPaused(true),
        onBlurCapture: () => setPaused(false),
      }
    : undefined;

  const current = count ? safeItems[index] : null;

  return (
    <div className={cn('absolute inset-0', className)} {...pauseHandlers}>
      <AnimatePresence initial={false} custom={direction}>
        {current ? (
          <motion.div
            key={current._id}
            custom={direction}
            initial={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <NextImage
              src={current.src[0]}
              alt={current.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {showArrows && count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className={cn(
              'hero-control absolute top-1/2 left-3 z-9998 -translate-y-1/2 rounded-full p-2 backdrop-blur transition',
              'focus:outline-none focus-visible:ring-2'
            )}
            style={{
              ['--tw-ring-color' as string]: 'var(--hero-control-ring)',
            }}
          >
            <FiChevronLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className={cn(
              'hero-control absolute top-1/2 right-3 z-9998 -translate-y-1/2 rounded-full p-2 backdrop-blur transition',
              'focus:outline-none focus-visible:ring-2'
            )}
            style={{
              ['--tw-ring-color' as string]: 'var(--hero-control-ring)',
            }}
          >
            <FiChevronRight size={20} />
          </button>
        </>
      ) : null}

      {showBars && count > 1 ? (
        <div className="pointer-events-auto absolute top-6 right-6 z-9999">
          <div className="flex items-center gap-2">
            {safeItems.map((it, i) => {
              const active = i === index;

              return (
                <button
                  key={`${it.src}-${i}`}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active ? 'true' : 'false'}
                  onClick={() => go(i, i > index ? 1 : -1)}
                  className={cn(
                    'hero-bar relative h-2 w-12 cursor-pointer overflow-hidden rounded-full transition-colors duration-200',
                    'focus:outline-none focus-visible:ring-2'
                  )}
                  style={{
                    ['--tw-ring-color' as string]: 'var(--hero-bar-ring)',
                  }}
                >
                  <span
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out',
                      active ? 'w-full' : 'w-0'
                    )}
                    style={{
                      backgroundColor:
                        'color-mix(in srgb, var(--accentcolor) 92%, white)',
                      boxShadow: active
                        ? '0 0 0.75rem color-mix(in srgb, var(--accentcolor) 55%, transparent)'
                        : 'none',
                    }}
                  />

                  <span
                    className="absolute inset-0 opacity-0 transition-opacity duration-200 hover:opacity-100"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accentcolor) 22%, transparent), transparent)',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
