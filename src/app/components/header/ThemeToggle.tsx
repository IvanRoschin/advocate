'use client';

import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

import { IconButton, Tooltip } from '@mui/material';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

function readInitialTheme(): ThemeMode {
  // Component is "use client", but this guard keeps it safe and predictable.
  if (typeof window === 'undefined') return 'light';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  const fromDom = document.documentElement.dataset.theme;
  if (fromDom === 'light' || fromDom === 'dark') return fromDom;

  return 'light';
}

export const ThemeToggle = () => {
  // ✅ Lazy init: no setState in an effect needed
  const [theme, setTheme] = useState<ThemeMode>(() => readInitialTheme());

  // ✅ Effect only syncs external system (DOM + storage) with React state
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Tooltip title={theme === 'dark' ? 'Світла тема' : 'Темна тема'}>
      <IconButton onClick={toggle} aria-label="toggle theme" size="small">
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </IconButton>
    </Tooltip>
  );
};
