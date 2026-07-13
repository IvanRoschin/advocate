'use client';

import { InfiniteScroll } from '@/app/components/common/InfiniteScroll';
import { apiUrl, routes } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { ServiceListItemDto } from '@/app/types';

import ServicesList from './ServicesList';
import { ServicesListSkeleton } from './ServicesListSkeleton';

interface ServicesFeedProps {
  initialItems: ServiceListItemDto[];
  hasMore: boolean;
  category?: string;
}

type ServicesListData = {
  items: ServiceListItemDto[];
  hasMore: boolean;
};

export function ServicesFeed({
  initialItems,
  hasMore,
  category,
}: ServicesFeedProps) {
  const loadMore = async (page: number) => {
    const params = new URLSearchParams({ page: String(page) });

    if (category) {
      params.set('category', category);
    }

    const res = await apiFetch<ServicesListData>(
      apiUrl(`${routes.api.v1.services}?${params}`)
    );

    return {
      data: res.items,
      hasMore: res.hasMore,
    };
  };

  return (
    <InfiniteScroll
      initialData={initialItems}
      initialHasMore={hasMore}
      loadMore={loadMore}
      renderContent={items => <ServicesList services={items} />}
      loader={<ServicesListSkeleton rows={3} />}
      emptyState={
        <div className="border-border bg-card rounded-2xl border p-6">
          <p className="text-app text-base leading-7">
            Наразі опублікованих послуг ще немає.
          </p>
        </div>
      }
      endMessage={
        <p className="text-muted-foreground text-center text-sm">
          Всі послуги завантажено
        </p>
      }
    />
  );
}
