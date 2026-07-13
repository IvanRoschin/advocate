import { Scale } from 'lucide-react';

import { cn } from '@/app/lib/utils';

export function NoCoverPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-muted flex h-full w-full items-center justify-center',
        className
      )}
    >
      <div className="border-border/60 bg-background/40 flex h-12 w-12 items-center justify-center rounded-full border">
        <Scale
          className="text-muted-foreground/70 h-5 w-5"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
    </div>
  );
}
