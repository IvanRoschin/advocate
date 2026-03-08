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
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => readInitialTheme());

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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
            className="border-border bg-background text-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring h-10 w-10 rounded-xl border leading-none shadow-sm"
          >
            <Icon className="h-5 w-5" aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
