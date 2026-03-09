'use client';

import { useEffect } from 'react';

import { useThemeStore } from '@/app/store/theme.store';

export function ThemeStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initTheme = useThemeStore(state => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return <>{children}</>;
}
