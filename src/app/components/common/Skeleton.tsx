import * as React from 'react';

import { cn } from '@/app/lib/utils/cn';

type SkeletonProps = React.ComponentPropsWithoutRef<'div'>;

export default function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-muted animate-shimmer from-muted via-foreground/10 to-muted rounded bg-linear-to-r bg-size-[200%_100%]',
        className
      )}
      {...rest}
    />
  );
}
