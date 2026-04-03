import { Card, CardContent } from '@/components/ui/card';

export function ArticleListPreviewSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="bg-muted h-44 w-full animate-pulse sm:h-36 sm:w-56" />
              <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                <div className="flex gap-2">
                  <div className="bg-muted h-5 w-24 animate-pulse rounded" />
                  <div className="bg-muted h-5 w-28 animate-pulse rounded" />
                </div>
                <div className="bg-muted h-6 w-4/5 animate-pulse rounded" />
                <div className="bg-muted h-4 w-full animate-pulse rounded" />
                <div className="bg-muted h-4 w-11/12 animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="bg-muted h-5 w-12 animate-pulse rounded" />
                  <div className="bg-muted h-5 w-14 animate-pulse rounded" />
                  <div className="bg-muted h-5 w-10 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
