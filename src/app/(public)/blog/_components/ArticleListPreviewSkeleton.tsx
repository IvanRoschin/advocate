import { Skeleton } from '@/app/components';
import { Card, CardContent } from '@/components/ui/card';

export function ArticleListPreviewSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <Skeleton className="h-44 w-full sm:h-36 sm:w-56" />
              <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
