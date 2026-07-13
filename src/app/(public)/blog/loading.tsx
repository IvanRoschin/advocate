import { Skeleton } from '@/app/components';

import { ArticleListPreviewSkeleton } from './_components/ArticleListPreviewSkeleton';

export default function BlogLoading() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="container pt-10 lg:pt-14">
        <div className="mb-8 max-w-3xl space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </section>

      <div className="container flex flex-col gap-8 lg:flex-row">
        <section className="min-w-0 flex-1">
          <ArticleListPreviewSkeleton rows={6} />
        </section>

        <aside className="w-full shrink-0 space-y-4 lg:w-80">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </aside>
      </div>
    </main>
  );
}
