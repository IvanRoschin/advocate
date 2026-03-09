'use client';

import { iconLibrary } from '@/app/resources/icons';
import { useThemeStore } from '@/app/store/theme.store';
import { Button } from '@/components/ui/button';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export const ThemeToggle = () => {
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  const isDark = theme === 'dark';
  const Icon = isDark ? iconLibrary.sun : iconLibrary.moon;
  const label = isDark ? 'Світла тема' : 'Темна тема';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={label}
            className="hover:bg-muted focus-visible:ring-ring h-10 w-10 rounded-xl leading-none"
          >
            <Icon
              className="h-5 w-5 text-yellow-500 dark:text-yellow-500"
              aria-hidden
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
