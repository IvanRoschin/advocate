import { revalidatePath } from 'next/cache';

import { articleQueries, articleRepo } from '../lib/repositories';
import {
  ArticleListItemDto,
  ArticlePublicPageDto,
  BlogCategoryItemDto,
  BlogRecentPostItemDto,
  mapArticleToResponse,
  mapPublicFullRowToPage,
  mapPublicRowToListItem,
  mapRecentRowToBlogItem,
} from '../types';
import { mapCategoryCountToBlogItem } from '../types/category/category.mapper';
import { createAction } from './createAction';
import { createEntityModule } from './createEntityModule';

export type PublicListResult = {
  items: ArticleListItemDto[];
  total: number;
  hasMore: boolean;
};

const articleEntityActions = createEntityModule({
  repo: articleRepo,

  toDTO: mapArticleToResponse,
  toListDTO: mapArticleToResponse,

  slug: {
    enabled: false,
  },

  validation: {
    notFoundMessage: 'Article not found',
    slugConflictMessage: 'Article slug already exists',
  },
});

export const articleActions = {
  ...articleEntityActions,
  create: async (...args: Parameters<typeof articleEntityActions.create>) => {
    const result = await articleEntityActions.create(...args);
    revalidatePath('/blog');
    revalidatePath(`/blog/${result.slug}`);
    return result;
  },
  update: async (...args: Parameters<typeof articleEntityActions.update>) => {
    const result = await articleEntityActions.update(...args);
    revalidatePath('/blog');
    revalidatePath(`/blog/${result.slug}`);
    return result;
  },
  delete: async (...args: Parameters<typeof articleEntityActions.delete>) => {
    const result = await articleEntityActions.delete(...args);
    revalidatePath('/blog');
    return result;
  },
};

export const articlePublicActions = {
  list: createAction<
    {
      page?: number;
      limit?: number;
      categorySlug?: string;
    },
    PublicListResult
  >(
    async ({ args }) => {
      const result = await articleQueries.list(args);

      return {
        ...result,
        items: result.items.map(mapPublicRowToListItem),
      };
    },
    { buildFallback: { items: [], total: 0, hasMore: false } }
  ),

  recent: createAction<number | undefined, BlogRecentPostItemDto[]>(
    async ({ args }) => {
      const raw = await articleQueries.recent(args);
      return raw.map(mapRecentRowToBlogItem);
    }
  ),

  related: createAction<
    { categoryId: string; excludeSlug: string; limit?: number },
    ArticleListItemDto[]
  >(async ({ args }) => {
    const raw = await articleQueries.related(args);
    return raw.map(mapPublicRowToListItem);
  }),

  categories: createAction<void, BlogCategoryItemDto[]>(
    async () => {
      const raw = await articleQueries.categories();
      return raw.map(mapCategoryCountToBlogItem);
    },
    { buildFallback: [] }
  ),

  findBySlug: createAction<string, ArticlePublicPageDto | null>(
    async ({ args: slug }) => {
      const article = await articleRepo.findBySlug(slug);
      if (!article) return null;
      return mapPublicFullRowToPage(article);
    }
  ),
};
