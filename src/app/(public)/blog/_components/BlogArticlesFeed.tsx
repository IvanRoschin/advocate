'use client';

import { InfiniteScroll } from '@/app/components/common/InfiniteScroll';
import { apiUrl, routes } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { blog } from '@/app/resources/content';
import { ArticleListItemDto } from '@/app/types';

import { ArticleListPreview } from './ArticleListPreview';
import { ArticleListPreviewSkeleton } from './ArticleListPreviewSkeleton';

interface BlogArticlesFeedProps {
  initialItems: ArticleListItemDto[];
  hasMore: boolean;
  category?: string;
}
type ArticlesListData = {
  items: ArticleListItemDto[];
  hasMore: boolean;
};

export function BlogArticlesFeed({
  initialItems,
  hasMore,
  category,
}: BlogArticlesFeedProps) {
  const loadMore = async (page: number) => {
    const params = new URLSearchParams({
      page: String(page),
    });

    if (category) {
      params.set('category', category);
    }

    const res = await apiFetch<ArticlesListData>(
      apiUrl(`${routes.api.v1.articles}?${params}`)
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
      renderContent={items => (
        <ArticleListPreview items={items} baseHref={blog.path} />
      )}
      loader={<ArticleListPreviewSkeleton rows={2} />}
      emptyState={
        <p className="text-muted-foreground py-12 text-center text-sm">
          Статей не знайдено
        </p>
      }
      endMessage={
        <p className="text-muted-foreground text-center text-sm">
          Всі статті завантажено
        </p>
      }
    />
  );
}
