import * as React from 'react';

import { cn } from '@/app/lib/utils/cn';

type SkeletonProps = React.ComponentPropsWithoutRef<'div'>;

export default function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-muted relative overflow-hidden rounded',
        "after:absolute after:inset-0 after:animate-shimmer after:bg-linear-to-r after:from-transparent after:via-foreground/10 after:to-transparent after:content-['']",
        className
      )}
      {...rest}
    />
  );
}
