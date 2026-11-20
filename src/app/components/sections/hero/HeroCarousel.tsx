'use client';

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

  // Слайди, які вже показувались, — лишаємо змонтованими (без повторного
  // завантаження і без зникнення з DOM). Похідний стан без useEffect.
  const [mounted, setMounted] = React.useState<Set<number>>(() => new Set([0]));
  if (!mounted.has(safeIndex)) {
    setMounted(prev => new Set(prev).add(safeIndex));
  }

  const variant = imageVariants.card;

  return (
    <div className="absolute inset-0" {...pauseHandlers}>
      {/*
        `className` (e.g. `z-0`) belongs only to the image layer. Applying
        it to this outer wrapper instead would create a stacking context
        that traps the arrows/bars below it — no button z-index could then
        lift them above the hero's z-30 content block on top.
      */}
      <div className={cn('absolute inset-0', className)}>
        {/*
          Усі слайди лежать стеком і перемикаються через opacity. Картинку
          першого слайду НІКОЛИ не прибираємо з DOM: якщо LCP-елемент
          видалити до появи наступного (як робив AnimatePresence mode="wait"
          при автопрокрутці), Chrome анулює LCP → Lighthouse NO_LCP.
          Інші слайди монтуються лише після першого показу (lazy).
        */}
        {safeItems.map((item, i) => {
          const active = i === safeIndex;
          const src = item.src?.[0] ? getCloudinarySrc(item.src[0]) : undefined;
          // наступний слайд підвантажуємо заздалегідь, щоб не було порожнього кадру
          const isNext = count > 1 && i === (safeIndex + 1) % count;
          if (!src || !(i === 0 || isNext || mounted.has(i))) return null;

          return (
            <div
              key={item._id ?? i}
              aria-hidden={!active}
              className={cn(
                'absolute inset-0 transition-opacity duration-500 ease-out',
                active ? 'opacity-100' : 'opacity-0'
              )}
            >
              <NextImage
                as={CldImage}
                src={src}
                alt={item.title}
                fill
                sizes={variant.sizes}
                useSkeleton={i !== 0}
                priority={i === 0}
                className="object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      {showArrows && count > 1 && (
        <>
          <button
            type="button"
            aria-label="Попередній слайд"
            onClick={prev}
            className={cn(
              'hero-control absolute bottom-4 left-3 z-50 rounded-full p-2 backdrop-blur transition',
              'sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2',
              'focus:outline-none focus-visible:ring-2'
            )}
          >
            <FiChevronLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Наступний слайд"
            onClick={next}
            className={cn(
              'hero-control absolute right-3 bottom-4 z-50 rounded-full p-2 backdrop-blur transition',
              'sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2',
              'focus:outline-none focus-visible:ring-2'
            )}
          >
            <FiChevronRight size={20} />
          </button>
        </>
      )}

      {/* Progress bars */}
      {showBars && count > 1 && (
        <div className="pointer-events-auto absolute top-16 right-6 z-50 sm:top-6">
          <div className="flex items-center gap-2">
            {safeItems.map((it, i) => {
              const active = i === safeIndex;

              return (
                <button
                  key={`${it._id}-${i}`}
                  type="button"
                  aria-label={`Слайд ${i + 1} з ${count}`}
                  aria-current={active ? 'true' : undefined}
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
