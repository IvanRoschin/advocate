'use client';

import { RefObject, useEffect, useState } from 'react';

export function useEscapeKey(onEscape: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [enabled, onEscape]);
}

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function useSwipeToClose<T extends HTMLElement>(opts: {
  enabled: boolean;
  ref: RefObject<T | null>;
  onClose: () => void;
  threshold?: number;
}) {
  const { enabled, ref, onClose, threshold = 50 } = opts;

  useEffect(() => {
    if (!enabled) return;

    const el = ref.current; // ✅ читаем ref.current только в effect
    if (!el) return;

    let startX: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startX == null) return;
      const currentX = e.touches[0]?.clientX ?? startX;
      const delta = currentX - startX;

      if (delta < -threshold) {
        onClose();
        startX = null;
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [enabled, ref, onClose, threshold]);
}

export function useHeaderScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.scrollY > threshold;
  });

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > threshold;
      setScrolled(prev => (prev === next ? prev : next));
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
