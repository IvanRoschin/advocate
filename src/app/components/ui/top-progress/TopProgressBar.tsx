'use client';

import { cn } from '@/lib';
import { useLoadingStore } from '@/store/loading.store';

export function TopProgressBar() {
  const progress = useLoadingStore(s => s.progress);
  const visible = progress > 0 && progress < 100;

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed top-0 left-0 z-9999 h-0.75 w-full transition-opacity duration-200',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div
        className="bg-foreground h-full w-full origin-left transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${visible ? progress / 100 : 0})` }}
      />
    </div>
  );
}
