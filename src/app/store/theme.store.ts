'use client';

import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function readThemeFromDom(): ThemeMode {
  if (typeof document === 'undefined') return 'dark';

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function readThemeFromStorage(): ThemeMode | null {
  if (typeof window === 'undefined') return null;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'light' || saved === 'dark' ? saved : null;
}

function applyThemeToDom(theme: ThemeMode) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

type ThemeStore = {
  theme: ThemeMode;
  initialized: boolean;
  initTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'dark',
  initialized: false,

  initTheme: () => {
    if (get().initialized) return;

    const theme = readThemeFromStorage() ?? readThemeFromDom() ?? 'dark';

    applyThemeToDom(theme);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }

    set({
      theme,
      initialized: true,
    });
  },

  setTheme: theme => {
    applyThemeToDom(theme);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }

    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
}));
