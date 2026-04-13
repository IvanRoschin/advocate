'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { cloudinaryLoader } from '@/app/lib/cloudinary/cloudinaryLoader';
import { getCloudinarySrc } from '@/app/lib/cloudinary/getCloudinarySrc';
import { NextImage } from '@/components';
import { cn } from '@/lib';

import type { SlideResponseDTO } from '@/app/types';

type HeroCarouselProps = {
  items: SlideResponseDTO[];
  autoplay?: boolean;
  intervalMs?: number;
  initialIndex?: number;
  className?: string;
  showArrows?: boolean;
  showBars?: boolean;
  pauseOnHover?: boolean;
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

  const [paused, setPaused] = React.useState(false);

  const go = React.useCallback(
    (nextIdx: number) => {
      if (count <= 1) return;
      const normalized = ((nextIdx % count) + count) % count;
      setIndex(normalized);
    },
    [count]
  );

  const next = React.useCallback(() => go(index + 1), [go, index]);
  const prev = React.useCallback(() => go(index - 1), [go, index]);

  // keyboard navigation
  React.useEffect(() => {
    if (count <= 1) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, next, prev]);

  // autoplay
  React.useEffect(() => {
    if (!autoplay || count <= 1 || paused) return;

    const id = window.setInterval(() => {
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

  // 🔥 normalize current src
  const currentSrc = getCloudinarySrc(current?.src?.[0]);

  // 🔥 preload next slide
  const nextIndex = count > 1 ? (index + 1) % count : 0;
  const nextSrc = getCloudinarySrc(safeItems[nextIndex]?.src?.[0]);

  return (
    <div className={cn('absolute inset-0', className)} {...pauseHandlers}>
      {nextSrc ? (
        <link
          rel="preload"
          as="image"
          href={cloudinaryLoader({
            src: nextSrc,
            width: 1200,
          })}
        />
      ) : null}

      <AnimatePresence mode="wait">
        {current && currentSrc ? (
          <motion.div
            key={current._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <NextImage
              useSkeleton
              loader={cloudinaryLoader}
              src={currentSrc}
              alt={current.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              fetchPriority="high"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* arrows */}
      {showArrows && count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className={cn(
              'hero-control absolute top-1/2 left-3 z-50 -translate-y-1/2 rounded-full p-2 backdrop-blur transition',
              'focus:outline-none focus-visible:ring-2'
            )}
          >
            <FiChevronLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className={cn(
              'hero-control absolute top-1/2 right-3 z-50 -translate-y-1/2 rounded-full p-2 backdrop-blur transition',
              'focus:outline-none focus-visible:ring-2'
            )}
          >
            <FiChevronRight size={20} />
          </button>
        </>
      ) : null}

      {/* progress bars */}
      {showBars && count > 1 ? (
        <div className="pointer-events-auto absolute top-6 right-6 z-50">
          <div className="flex items-center gap-2">
            {safeItems.map((it, i) => {
              const active = i === index;

              return (
                <button
                  key={`${it._id}-${i}`}
                  type="button"
                  onClick={() => go(i)}
                  className={cn(
                    'relative h-2 w-12 overflow-hidden rounded-full',
                    'focus:outline-none focus-visible:ring-2'
                  )}
                >
                  <span
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
                      active ? 'w-full' : 'w-0'
                    )}
                    style={{
                      backgroundColor:
                        'color-mix(in srgb, var(--accentcolor) 92%, white)',
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
