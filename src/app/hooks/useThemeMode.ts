'use client';

import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

function readTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(() => readTheme());

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    };

    updateTheme();

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}
