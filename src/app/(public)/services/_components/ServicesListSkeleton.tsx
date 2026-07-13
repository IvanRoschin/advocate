import { Skeleton } from '@/app/components';

export function ServicesListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="border-border bg-card overflow-hidden rounded-2xl border"
        >
          <Skeleton className="aspect-16/10 w-full" />

          <div className="space-y-3 p-5">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
