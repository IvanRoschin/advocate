import { Skeleton } from '@/app/components';

import { ServicesListSkeleton } from './_components/ServicesListSkeleton';

export default function ServicesLoading() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="container">
        <section className="min-w-0">
          <div className="mb-20 max-w-3xl space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        </section>

        <ServicesListSkeleton rows={6} />
      </div>
    </main>
  );
}
