'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

/**
 * Легкий fade при переході між сторінками — на CSS (tw-animate-css),
 * без framer-motion у загальному бандлі кожної сторінки.
 * Перше завантаження не анімуємо: контент видимий одразу (LCP).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [initialPath] = useState(pathname);
  const [navigated, setNavigated] = useState(false);

  if (!navigated && pathname !== initialPath) {
    setNavigated(true);
  }

  return (
    <div
      key={pathname}
      className={
        navigated ? 'animate-in fade-in duration-200 ease-out' : undefined
      }
    >
      {children}
    </div>
  );
}
