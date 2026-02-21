'use client';

import { useEffect, useMemo, useState } from 'react';

import { iconLibrary } from '@/app/resources/icons';
import { Button } from '@/components/ui/button';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  const fromDom = document.documentElement.dataset.theme;
  if (fromDom === 'light' || fromDom === 'dark') return fromDom;

  return 'light';
}

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => readInitialTheme());

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const Icon = useMemo(() => {
    return theme === 'dark' ? iconLibrary.sun : iconLibrary.moon;
  }, [theme]);

  const label = theme === 'dark' ? 'Світла тема' : 'Темна тема';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={label}
            className="h-10 w-10 rounded-xl leading-none"
          >
            <Icon className="h-5 w-5" aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
