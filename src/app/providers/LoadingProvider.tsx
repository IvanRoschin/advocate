'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useLoadingStore } from '@/store/loading.store.ts';

type Props = { children: React.ReactNode };

export function LoadingProvider({ children }: Props) {
  const pathname = usePathname();

  const isLoading = useLoadingStore(s => s.isLoading);
  const progress = useLoadingStore(s => s.progress);
  const setProgress = useLoadingStore(s => s.setProgress);
  const done = useLoadingStore(s => s.done);

  const rafRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1) Когда маршрут реально сменился — считаем, что переход завершён.
  useEffect(() => {
    if (isLoading) done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 2) “Премиум” прогресс-эмуляция: пока isLoading=true, растём до ~90%.
  useEffect(() => {
    if (!isLoading) return;

    const tick = () => {
      // чем ближе к 90, тем медленнее
      const cap = 90;
      const current = useLoadingStore.getState().progress;
      if (current < cap) {
        const delta = Math.max(0.2, (cap - current) * 0.02);
        setProgress(current + delta);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isLoading, setProgress]);

  // 3) Когда done() выставляет progress=100, аккуратно сбрасываем в 0.
  useEffect(() => {
    if (isLoading) return;
    if (progress < 100) return;

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    hideTimerRef.current = setTimeout(() => {
      setProgress(0);
    }, 250);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    };
  }, [isLoading, progress, setProgress]);

  return <>{children}</>;
}
