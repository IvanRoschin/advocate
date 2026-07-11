'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CldImage } from 'next-cloudinary';
import * as React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { imageVariants } from '@/app/config/imageVariants';
import { getCloudinarySrc } from '@/app/lib/cloudinary/getCloudinarySrc';
import { cn } from '@/lib';

import { NextImage } from '../../common';

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

  // ✅ initial index only on first render
  const [index, setIndex] = React.useState(() => {
    if (!count) return 0;
    return Math.max(0, Math.min(initialIndex, count - 1));
  });

  const [paused, setPaused] = React.useState(false);

  // ✅ derive safe index instead of setState in effect
  const safeIndex = count ? Math.max(0, Math.min(index, count - 1)) : 0;

  const go = React.useCallback(
    (nextIdx: number) => {
      if (count <= 1) return;
      const normalized = ((nextIdx % count) + count) % count;
      setIndex(normalized);
    },
    [count]
  );

  const next = React.useCallback(() => {
    go(safeIndex + 1);
  }, [go, safeIndex]);

  const prev = React.useCallback(() => {
    go(safeIndex - 1);
  }, [go, safeIndex]);

  // Keyboard navigation
  React.useEffect(() => {
    if (count <= 1) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [count, next, prev]);

  // Autoplay
  React.useEffect(() => {
    if (!autoplay || count <= 1 || paused) return;

    const id = window.setInterval(() => {
      setIndex(i => (i + 1) % count);
    }, intervalMs);

    return () => {
      window.clearInterval(id);
    };
  }, [autoplay, count, intervalMs, paused]);

  const pauseHandlers = pauseOnHover
    ? {
        onMouseEnter: () => setPaused(true),
        onMouseLeave: () => setPaused(false),
        onFocusCapture: () => setPaused(true),
        onBlurCapture: () => setPaused(false),
      }
    : undefined;

  const current = count ? safeItems[safeIndex] : null;

  // Normalize current src
  const publicId = current?.src?.[0]
    ? getCloudinarySrc(current.src[0])
    : undefined;

  const variant = imageVariants.card;

  return (
    <div className={cn('absolute inset-0', className)} {...pauseHandlers}>
      <AnimatePresence mode="wait">
        {current && publicId ? (
          <motion.div
            key={current._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <NextImage
              as={CldImage}
              src={publicId}
              alt={current.title}
              fill
              sizes={variant.sizes}
              useSkeleton
              preload={safeIndex === 0}
              className="object-cover"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Arrows */}
      {showArrows && count > 1 && (
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
      )}

      {/* Progress bars */}
      {showBars && count > 1 && (
        <div className="pointer-events-auto absolute top-6 right-6 z-50">
          <div className="flex items-center gap-2">
            {safeItems.map((it, i) => {
              const active = i === safeIndex;

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
      )}
    </div>
  );
}
