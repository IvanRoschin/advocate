'use client';

import { InfiniteScroll } from '@/app/components/common/InfiniteScroll';
import { blog } from '@/app/resources/content';
import { ArticleListItemDto } from '@/app/types';

import { ArticleListPreview } from './ArticleListPreview';

interface BlogArticlesFeedProps {
  initialItems: ArticleListItemDto[];
  hasMore: boolean;
  category?: string;
}

export function BlogArticlesFeed({
  initialItems,
  category,
}: BlogArticlesFeedProps) {
  const loadMore = async (page: number) => {
    const params = new URLSearchParams({
      page: String(page),
    });

    if (category) {
      params.set('category', category);
    }

    const response = await fetch(`/api/v1/articles?${params}`);

    const json = await response.json();

    return {
      data: json.data,
      hasMore: json.hasMore,
    };
  };

  return (
    <InfiniteScroll
      initialData={initialItems}
      loadMore={loadMore}
      renderContent={items => (
        <ArticleListPreview items={items} baseHref={blog.path} />
      )}
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
