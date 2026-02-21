'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useLoadingStore } from '@/app/store/loading.store.ts';

export function RouteLoadingReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const done = useLoadingStore(s => s.done);

  useEffect(() => {
    // если переход состоялся — закрываем лоадер
    done();
  }, [pathname, searchParams, done]);

  return null;
}
